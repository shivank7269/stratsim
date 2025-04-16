document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const closeBtns = document.querySelectorAll('.close-modal, .close-btn');
    const newsletterForm = document.getElementById('newsletter-form');
    const demoBtn = document.getElementById('demo-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authButtons = document.querySelector('.auth-buttons'); // Select the auth-buttons div
    let userFullName = null;

    function updateUI(loggedIn, fullName = null) {
        const authButtons = document.querySelector('.auth-buttons'); // Get auth buttons div
        let userInfo = document.getElementById('user-info');

        if (loggedIn) {
            // Hide login/signup buttons
            if(authButtons) authButtons.style.display = 'none';

            // Create user info div if it doesn't exist
            if (!userInfo) {
                userInfo = document.createElement('div');
                userInfo.id = 'user-info';
                authButtons.parentNode.insertBefore(userInfo, authButtons); // Insert before authButtons
            }

            // Update user info content
            userInfo.innerHTML = `Welcome, ${fullName}!  <a href="#" id="logout-btn" style="color:white">Logout</a>`;

            // Attach event listener to logout button
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                
                logoutBtn.addEventListener('click', logout);
                
            } else {
                console.warn("Logout button not found after creation.");
            }

        } else {
            // Show login/signup buttons
            if(authButtons) authButtons.style.display = 'flex';

            // Remove user info
            if (userInfo) {
                userInfo.remove();
            }
        }
    }

    function checkSession() {
        fetch('stratsim_api/session.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.loggedIn) {
                    userFullName = data.full_name;
                    updateUI(true, data.full_name);
                } else {
                    updateUI(false);
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
                updateUI(false);
            });
    }

    function logout() {
        fetch('stratsim_api/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateUI(false);
                }
            })
            .catch(error => console.error('Error during logout:', error));
    }

    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'flex';
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        fetch('stratsim_api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                loginModal.style.display = 'none';
                userFullName = data.full_name;
                updateUI(true, data.full_name);
            } else {
                alert(data.message); // Show login error
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('Login failed. Please try again.');
        });
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }

        fetch('stratsim_api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `full_name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                signupModal.style.display = 'none';
                alert('Registration successful! Please login.');
            } else {
                alert(data.message); // Show registration error
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
            alert('Signup failed. Please try again.');
        });
    });

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // This would typically send data to a PHP script
        alert('Thank you for subscribing to our newsletter!');
    });

    demoBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Demo version would be launched here');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            e.preventDefault();

            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Play Now Button Handling
    const playNowButtons = document.querySelectorAll('.play-now');

    playNowButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            console.log('Play Now button clicked');

            event.preventDefault();

            const gameId = this.dataset.game;
            const gameUrl = this.dataset.url;

          // Make an AJAX request to check login status
          fetch('stratsim_api/session.php')
              .then(response => {
                  console.log('Response received:', response);
                  return response.json();
              })
              .then(data => {
                  console.log('Data received:', data);
                  if (data.loggedIn) {
                      // User is logged in, redirect to the specified URL
                      if (gameUrl) {
                          console.log('Redirecting to game URL:', gameUrl);
                          window.location.href = gameUrl;
                      } else {
                          console.warn('No game URL specified for game:', gameId);
                          alert('No game URL available for this game.');
                      }
                  } else {
                      // User is not logged in, show the login modal
                      loginModal.style.display = 'flex';
                  }
              })
              .catch(error => {
                  console.error('Error checking login status:', error);
                  alert('An error occurred while checking login status.');
              });
        });
    });

    // Check session on page load
    checkSession();
});