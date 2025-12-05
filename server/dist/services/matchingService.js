"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearbyUsers = exports.matchUsersByRoute = void 0;
// A mock database of user profiles for demonstration purposes
const userProfiles = [
    { id: 1, name: 'Alice', location: 'New York', travelRoute: 'NY to CA' },
    { id: 2, name: 'Bob', location: 'Los Angeles', travelRoute: 'CA to NY' },
    { id: 3, name: 'Charlie', location: 'Chicago', travelRoute: 'IL to TX' },
    // Add more profiles as needed
];
// Function to match users based on their travel routes
const matchUsersByRoute = (userId) => {
    const currentUser = userProfiles.find(user => user.id === userId);
    if (!currentUser) {
        return [];
    }
    return userProfiles.filter(user => user.id !== userId && user.travelRoute === currentUser.travelRoute);
};
exports.matchUsersByRoute = matchUsersByRoute;
// Function to find nearby users based on location
const findNearbyUsers = (location) => {
    return userProfiles.filter(user => user.location === location);
};
exports.findNearbyUsers = findNearbyUsers;
