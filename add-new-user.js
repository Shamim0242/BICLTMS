// Script to add a new user to the system
function addNewUser() {
    // User details
    const username = "Faruk.khan@bga-bd.com";
    const password = "1234";
    const isAdmin = false; // Set to true if this should be an admin user

    // Get current users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.username === username)) {
        console.log('User already exists!');
        return;
    }
    
    // Add new user
    users.push({
        username: username,
        password: password,
        isAdmin: isAdmin,
        email: username // Using email as the username
    });
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    console.log('User added successfully!');
    console.log('New user details:', {
        username,
        password,
        isAdmin
    });
}

// Execute the function
addNewUser(); 