// Script to add a new user to the Fleet Management System
// User: anwarhossain, Password: 1234

// Function to add a user directly
function addNewUser(username, password, isAdmin = false) {
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
        console.log(`User ${username} already exists!`);
        return false;
    }
    
    // Create new user object
    const newUser = {
        username: username,
        password: password,
        isAdmin: isAdmin,
        email: username // Use username as email
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log(`User ${username} added successfully!`);
    return true;
}

// Execute to add the specified user
addNewUser('anwarhossain', '1234');

// Display confirmation
console.log('User "anwarhossain" with password "1234" has been added to the system!');
console.log('You can now login with these credentials.');

