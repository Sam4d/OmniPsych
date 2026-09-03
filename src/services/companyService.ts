import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import { CompanyTeam, CompanyMember, Archetype, UserPsychologicalVector, UserProfile } from '../types';
import { getArchetypeById } from '../utils/scoring';

const LOCAL_COMPANY_STORAGE_KEY = 'omnipsyche_active_company';
const LOCAL_COMPANIES_CACHE_KEY = 'omnipsyche_saved_companies';

/**
 * Generate a unique memorable 6-char company code e.g. "CORP-94827" or "OP-83920"
 */
export function generateCompanyCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CORP-${code}`;
}

/**
 * Default starter company demo for immediate exploration
 */
export function getDefaultDemoCompany(userArchetype: Archetype, userVector: UserPsychologicalVector): CompanyTeam {
  return {
    id: 'acme-corp-demo',
    name: 'Acme Innovation Lab',
    companyCode: 'CORP-ACME88',
    adminUid: 'alex-admin',
    adminName: 'Alex Rivera',
    industry: 'Technology & AI Labs',
    department: 'Core Product & Architecture',
    members: [
      {
        uid: 'alex-admin',
        displayName: 'Alex Rivera (You)',
        role: 'Founder & Principal Architect',
        archetypeId: userArchetype.id,
        archetypeTitle: userArchetype.name,
        variant: userVector.identityVariant,
        house: userArchetype.house,
        avatarColor: '#FFE600',
        isAdmin: true,
        joinedAt: new Date().toISOString()
      },
      {
        uid: 'marcus-chen',
        displayName: 'Marcus Chen',
        role: 'Head of Engineering',
        archetypeId: 'intp',
        archetypeTitle: 'The Alchemist',
        variant: 'A',
        house: 'The Strategists',
        avatarColor: '#6366F1',
        isAdmin: false,
        joinedAt: new Date(Date.now() - 86400000 * 12).toISOString()
      },
      {
        uid: 'elena-rostova',
        displayName: 'Elena Rostova',
        role: 'VP of Product',
        archetypeId: 'entj',
        archetypeTitle: 'The Commander',
        variant: 'A',
        house: 'The Strategists',
        avatarColor: '#F59E0B',
        isAdmin: false,
        joinedAt: new Date(Date.now() - 86400000 * 8).toISOString()
      },
      {
        uid: 'sophia-miller',
        displayName: 'Sophia Miller',
        role: 'Lead UX & Interaction',
        archetypeId: 'enfp',
        archetypeTitle: 'The Visionary',
        variant: 'T',
        house: 'The Diplomats',
        avatarColor: '#10B981',
        isAdmin: false,
        joinedAt: new Date(Date.now() - 86400000 * 4).toISOString()
      },
      {
        uid: 'david-vance',
        displayName: 'David Vance',
        role: 'Infrastructure Director',
        archetypeId: 'istj',
        archetypeTitle: 'The Sentinel',
        variant: 'A',
        house: 'The Navigators',
        avatarColor: '#0EA5E9',
        isAdmin: false,
        joinedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Save active company in local storage
 */
export function saveLocalActiveCompany(company: CompanyTeam): void {
  try {
    localStorage.setItem(LOCAL_COMPANY_STORAGE_KEY, JSON.stringify(company));
    
    // Also save into multi-company cache
    const existingStr = localStorage.getItem(LOCAL_COMPANIES_CACHE_KEY);
    const existing: CompanyTeam[] = existingStr ? JSON.parse(existingStr) : [];
    const index = existing.findIndex(c => c.id === company.id || c.companyCode === company.companyCode);
    if (index >= 0) {
      existing[index] = company;
    } else {
      existing.unshift(company);
    }
    localStorage.setItem(LOCAL_COMPANIES_CACHE_KEY, JSON.stringify(existing.slice(0, 10)));
  } catch (err) {
    console.warn('Failed to save company locally:', err);
  }
}

/**
 * Get saved active company from local storage
 */
export function getLocalActiveCompany(): CompanyTeam | null {
  try {
    const raw = localStorage.getItem(LOCAL_COMPANY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load local company:', err);
  }
  return null;
}

/**
 * Create a brand new Company workspace (assigning creator as Admin)
 */
export async function createCompanyTeam(
  companyName: string,
  department: string,
  adminRole: string,
  user: any | null,
  userProfile: UserProfile | null,
  userArchetype: Archetype,
  userVector: UserPsychologicalVector
): Promise<CompanyTeam> {
  const companyId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const companyCode = generateCompanyCode();
  const creatorUid = user?.uid || `usr_local_${Date.now()}`;
  const creatorName = userProfile?.displayName || user?.displayName || 'Team Founder';
  const avatarColor = userProfile?.avatarColor || '#FFE600';

  const adminMember: CompanyMember = {
    uid: creatorUid,
    displayName: `${creatorName} (Admin)`,
    role: adminRole || 'Company Founder & Admin',
    archetypeId: userArchetype.id,
    archetypeTitle: userArchetype.name,
    variant: userVector.identityVariant,
    house: userArchetype.house,
    avatarColor: avatarColor,
    isAdmin: true,
    joinedAt: new Date().toISOString(),
    vector: userVector
  };

  const newCompany: CompanyTeam = {
    id: companyId,
    name: companyName.trim(),
    companyCode: companyCode,
    adminUid: creatorUid,
    adminName: creatorName,
    department: department.trim() || 'Core Team',
    members: [adminMember],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveLocalActiveCompany(newCompany);

  // Sync to Firestore if authenticated
  if (user) {
    try {
      const compRef = doc(db, 'companies', companyId);
      await setDoc(compRef, newCompany);
    } catch (err) {
      console.warn('Firestore company save skipped (offline fallback used):', err);
    }
  }

  return newCompany;
}

/**
 * Join an existing company by its unique Company Code or link
 */
export async function joinCompanyByCode(
  codeOrLink: string,
  userRole: string,
  user: any | null,
  userProfile: UserProfile | null,
  userArchetype: Archetype,
  userVector: UserPsychologicalVector
): Promise<{ success: boolean; company?: CompanyTeam; error?: string }> {
  // Clean up input in case they pasted full link e.g. https://...?joinCompany=CORP-94827
  let cleanCode = codeOrLink.trim();
  if (cleanCode.includes('joinCompany=')) {
    const parts = cleanCode.split('joinCompany=');
    cleanCode = parts[1].split('&')[0];
  } else if (cleanCode.includes('company=')) {
    const parts = cleanCode.split('company=');
    cleanCode = parts[1].split('&')[0];
  }
  cleanCode = cleanCode.toUpperCase();

  if (!cleanCode) {
    return { success: false, error: 'Please enter a valid Company Code or invite link.' };
  }

  const myUid = user?.uid || `usr_local_${Date.now()}`;
  const myName = userProfile?.displayName || user?.displayName || 'Team Teammate';
  const avatarColor = userProfile?.avatarColor || '#6366F1';

  let foundCompany: CompanyTeam | null = null;

  // Try Firestore search first if online
  try {
    const compRef = collection(db, 'companies');
    const q = query(compRef, where('companyCode', '==', cleanCode), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      foundCompany = snap.docs[0].data() as CompanyTeam;
    }
  } catch (err) {
    console.warn('Firestore company search fell back to local cache:', err);
  }

  // Fallback to local cache if not found on Firestore
  if (!foundCompany) {
    try {
      const cachedStr = localStorage.getItem(LOCAL_COMPANIES_CACHE_KEY);
      if (cachedStr) {
        const cachedList: CompanyTeam[] = JSON.parse(cachedStr);
        const match = cachedList.find(c => c.companyCode.toUpperCase() === cleanCode);
        if (match) foundCompany = match;
      }
      
      const activeStr = localStorage.getItem(LOCAL_COMPANY_STORAGE_KEY);
      if (!foundCompany && activeStr) {
        const active: CompanyTeam = JSON.parse(activeStr);
        if (active.companyCode.toUpperCase() === cleanCode) {
          foundCompany = active;
        }
      }
    } catch (e) {
      console.warn('Local check failed:', e);
    }
  }

  // Handle demo code explicitly
  if (!foundCompany && (cleanCode === 'CORP-ACME88' || cleanCode === 'ACME88')) {
    foundCompany = getDefaultDemoCompany(userArchetype, userVector);
  }

  if (!foundCompany) {
    return { 
      success: false, 
      error: `No organization found for code "${cleanCode}". Please verify the code with your team admin.` 
    };
  }

  // Create member entry
  const newMember: CompanyMember = {
    uid: myUid,
    displayName: myName,
    role: userRole.trim() || 'Team Specialist',
    archetypeId: userArchetype.id,
    archetypeTitle: userArchetype.name,
    variant: userVector.identityVariant,
    house: userArchetype.house,
    avatarColor: avatarColor,
    isAdmin: foundCompany.adminUid === myUid,
    joinedAt: new Date().toISOString(),
    vector: userVector
  };

  // Check if already in roster
  const existingIdx = foundCompany.members.findIndex(m => m.uid === myUid || m.displayName === myName);
  let updatedMembers: CompanyMember[];
  if (existingIdx >= 0) {
    updatedMembers = [...foundCompany.members];
    updatedMembers[existingIdx] = {
      ...updatedMembers[existingIdx],
      role: userRole.trim() || updatedMembers[existingIdx].role,
      archetypeId: userArchetype.id,
      archetypeTitle: userArchetype.name,
      variant: userVector.identityVariant,
      house: userArchetype.house,
      vector: userVector
    };
  } else {
    updatedMembers = [...foundCompany.members, newMember];
  }

  const updatedCompany: CompanyTeam = {
    ...foundCompany,
    members: updatedMembers,
    updatedAt: new Date().toISOString()
  };

  saveLocalActiveCompany(updatedCompany);

  // Sync to Firestore if authenticated
  if (user && foundCompany.id) {
    try {
      const docRef = doc(db, 'companies', foundCompany.id);
      await updateDoc(docRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Firestore join update skipped or completed locally:', e);
    }
  }

  return { success: true, company: updatedCompany };
}

/**
 * Remove a member (Admin only)
 */
export async function removeCompanyMember(
  company: CompanyTeam,
  memberUid: string,
  currentUserId: string
): Promise<CompanyTeam> {
  // Prevent removing admin or unauthorized removal
  if (company.adminUid !== currentUserId && !company.members.find(m => m.uid === currentUserId)?.isAdmin) {
    throw new Error('Only the company Admin can remove team members.');
  }

  const updatedMembers = company.members.filter(m => m.uid !== memberUid);
  const updatedCompany: CompanyTeam = {
    ...company,
    members: updatedMembers,
    updatedAt: new Date().toISOString()
  };

  saveLocalActiveCompany(updatedCompany);

  if (company.id && !company.id.includes('demo')) {
    try {
      const docRef = doc(db, 'companies', company.id);
      await updateDoc(docRef, {
        members: updatedMembers,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Firestore member remove skipped or failed:', err);
    }
  }

  return updatedCompany;
}
