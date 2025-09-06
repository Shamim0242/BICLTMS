// Script to add a new user to the Fleet Management System

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

// Execute to add the specified users
addNewUser('faruk.khan@bga-bd.com', '1234');
addNewUser('anwarhossain', '1234');

// Print all users for verification
console.log("Current users:", JSON.parse(localStorage.getItem('users'))); 