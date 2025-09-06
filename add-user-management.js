// User Management script for vehicles.html
// To use: 
// 1. Include this file with a script tag at the end of vehicles.html
// OR
// 2. Copy and paste this code into the browser console when viewing vehicles.html

(function() {
    // Create user management link in navigation
    function addUserManagementLink() {
        const userActions = document.querySelector('.user-actions');
        if (!userActions) return;
        
        // Skip if link already exists
        if (userActions.querySelector('a[data-role="user-management"]')) return;
        
        // Create user management link
        const userManagementLink = document.createElement('a');
        userManagementLink.href = '#';
        userManagementLink.textContent = 'User Management';
        userManagementLink.setAttribute('data-role', 'user-management');
        userManagementLink.onclick = function(e) {
            e.preventDefault();
            showUserManagement();
        };
        
        // Insert after the welcome span and before Theme link
        const welcomeSpan = userActions.querySelector('span');
        if (welcomeSpan) {
            userActions.insertBefore(userManagementLink, welcomeSpan.nextSibling);
            // Add a space after the link for better formatting
            userActions.insertBefore(document.createTextNode(' '), userManagementLink.nextSibling);
        }
    }

    // User Management Functions
    window.showUserManagement = function() {
        refreshUserList();
        document.getElementById('userManagementModal').style.display = 'block';
    };

    window.closeUserManagement = function() {
        document.getElementById('userManagementModal').style.display = 'none';
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('is-admin').checked = false;
    };

    window.refreshUserList = function() {
        const userList = document.getElementById('user-list');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        userList.innerHTML = `
            <table style="width:100%; border-collapse: collapse;">
                <tr style="background-color: #f2f2f2;">
                    <th style="text-align: left; padding: 8px;">Username</th>
                    <th style="text-align: left; padding: 8px;">Admin</th>
                    <th style="text-align: left; padding: 8px;">Actions</th>
                </tr>
                ${users.map(user => `
                    <tr>
                        <td style="padding: 8px;">${user.username}</td>
                        <td style="padding: 8px;">${user.isAdmin ? 'Yes' : 'No'}</td>
                        <td style="padding: 8px;">
                            <button onclick="resetUserPassword('${user.username}')" style="margin-right: 5px;">Reset Password</button>
                            ${user.username !== 'admin' ? `<button onclick="deleteUser('${user.username}')">Delete</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    };

    window.addUser = function() {
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        const isAdmin = document.getElementById('is-admin').checked;
        
        if (!username || !password) {
            alert('Username and password are required!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.some(u => u.username === username)) {
            alert('Username already exists!');
            return;
        }
        
        users.push({
            username: username,
            password: password,
            isAdmin: isAdmin,
            email: `${username}@example.com` // Default email
        });
        
        localStorage.setItem('users', JSON.stringify(users));
        refreshUserList();
        
        // Clear form
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('is-admin').checked = false;
    };

    window.resetUserPassword = function(username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].password = '1234';
            localStorage.setItem('users', JSON.stringify(users));
            alert(`Password for ${username} has been reset to '1234'`);
        }
    };

    window.deleteUser = function(username) {
        if (confirm(`Are you sure you want to delete user '${username}'?`)) {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const filteredUsers = users.filter(u => u.username !== username);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            refreshUserList();
        }
    };

    window.changePassword = function() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-user-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const messageDiv = document.getElementById('password-message');
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            messageDiv.textContent = 'All fields are required!';
            messageDiv.style.color = 'red';
            return;
        }
        
        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'New password and confirm password do not match!';
            messageDiv.style.color = 'red';
            return;
        }
        
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            messageDiv.textContent = 'You are not logged in!';
            messageDiv.style.color = 'red';
            return;
        }
        
        // Get all users to update the password
        const users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex === -1) {
            messageDiv.textContent = 'User not found!';
            messageDiv.style.color = 'red';
            return;
        }
        
        if (users[userIndex].password !== currentPassword) {
            messageDiv.textContent = 'Current password is incorrect!';
            messageDiv.style.color = 'red';
            return;
        }
        
        // Update password
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Also update current user
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        messageDiv.textContent = 'Password changed successfully!';
        messageDiv.style.color = 'green';
        
        // Clear fields
        document.getElementById('current-password').value = '';
        document.getElementById('new-user-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Close modal after a delay
        setTimeout(function() {
            closeChangePassword();
        }, 2000);
    };

    window.closeChangePassword = function() {
        document.getElementById('changePasswordModal').style.display = 'none';
        document.getElementById('current-password').value = '';
        document.getElementById('new-user-password').value = '';
        document.getElementById('confirm-password').value = '';
        document.getElementById('password-message').textContent = '';
    };
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addUserManagementLink);
    } else {
        addUserManagementLink();
    }
    
    console.log('User Management functionality has been activated!');
})(); 