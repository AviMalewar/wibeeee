import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const calculateMatchScore = (userA, userB) => {
  if (!userA || !userB || userA.uid === userB.uid) return 0;

  const categories = ['music', 'movies', 'hobbies', 'skills', 'goals'];
  let totalCommon = 0;
  let totalPossible = 0;

  categories.forEach(category => {
    const listA = userA[category] || [];
    const listB = userB[category] || [];
    
    const common = listA.filter(item => listB.includes(item));
    totalCommon += common.length;
    
    // We can normalize this differently, but let's say each common interest adds value
    // Or just count total unique interests across both as denominator
    const uniqueInterests = new Set([...listA, ...listB]);
    totalPossible += uniqueInterests.size;
  });

  // Personality match
  if (userA.personality === userB.personality) totalCommon += 2;
  totalPossible += 2;

  // Availability match
  if (userA.availability === userB.availability) totalCommon += 1;
  totalPossible += 1;

  if (totalPossible === 0) return 0;
  
  const score = (totalCommon / totalPossible) * 100;
  return Math.min(Math.round(score), 100);
};

export const getMatches = async (currentUser) => {
  if (!currentUser) return [];

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("profileComplete", "==", true));
  const querySnapshot = await getDocs(q);
  
  const matches = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const uid = userData.uid || doc.id;
    if (uid !== currentUser.uid) {
      const score = calculateMatchScore(currentUser, { ...userData, uid });
      matches.push({
        ...userData,
        uid,
        matchScore: score,
        commonInterests: getCommonInterests(currentUser, { ...userData, uid })
      });
    }
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

export const subscribeToMatches = (currentUser, callback) => {
  if (!currentUser) return () => {};

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("profileComplete", "==", true));

  return onSnapshot(q, (querySnapshot) => {
    const matches = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const uid = userData.uid || doc.id;
      if (uid !== currentUser.uid) {
        const score = calculateMatchScore(currentUser, { ...userData, uid });
        matches.push({
          ...userData,
          uid,
          matchScore: score,
          commonInterests: getCommonInterests(currentUser, { ...userData, uid })
        });
      }
    });
    callback(matches.sort((a, b) => b.matchScore - a.matchScore));
  });
};

export const subscribeToAllStudents = (currentUser, callback) => {
  const usersRef = collection(db, "users");
  // Show all students regardless of profile completion status
  const q = query(usersRef);

  return onSnapshot(q, (querySnapshot) => {
    const students = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const uid = userData.uid || doc.id;
      if (!currentUser || uid !== currentUser.uid) {
        students.push({
          ...userData,
          uid,
        });
      }
    });
    callback(students);
  });
};

const getCommonInterests = (userA, userB) => {
  const categories = ['music', 'movies', 'hobbies', 'skills', 'goals'];
  const common = [];
  
  categories.forEach(cat => {
    const listA = userA[cat] || [];
    const listB = userB[cat] || [];
    const shared = listA.filter(item => listB.includes(item));
    common.push(...shared);
  });
  
  return common.slice(0, 5); // Return top 5 common interests
};
