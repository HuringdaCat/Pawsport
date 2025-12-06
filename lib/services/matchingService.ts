interface UserProfile {
    id: number;
    name: string;
    location: string;
    travelRoute: string;
}

// A mock database of user profiles for demonstration purposes
const userProfiles: UserProfile[] = [
    { id: 1, name: 'Alice', location: 'New York', travelRoute: 'NY to CA' },
    { id: 2, name: 'Bob', location: 'Los Angeles', travelRoute: 'CA to NY' },
    { id: 3, name: 'Charlie', location: 'Chicago', travelRoute: 'IL to TX' },
];

export class MatchingService {
    public matchUsersByRoute(userId: number): UserProfile[] {
        const currentUser = userProfiles.find(user => user.id === userId);
        if (!currentUser) {
            return [];
        }

        return userProfiles.filter(user => 
            user.id !== userId && user.travelRoute === currentUser.travelRoute
        );
    }

    public findNearbyUsers(location: string): UserProfile[] {
        return userProfiles.filter(user => user.location === location);
    }
}

export default new MatchingService();