// 1. Password Visibility Toggle
        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('ri-eye-off-line');
                icon.classList.add('ri-eye-line');
            } else {
                input.type = "password";
                icon.classList.add('ri-eye-off-line');
                icon.classList.remove('ri-eye-line');
            }
        }

        // 2. Switch between Login and Signup
        function toggleForm() {
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const title = document.getElementById('form-title');
            const toggleText = document.getElementById('toggle-text');

            if (loginForm.classList.contains('hidden')) {
                // Switch to Login
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
                title.innerText = "Welcome back!";
                toggleText.innerHTML = 'New here? <a onclick="toggleForm()">Sign up now &rarr;</a>';
            } else {
                // Switch to Signup
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                title.innerText = "Create Account";
                toggleText.innerHTML = 'Already have an account? <a onclick="toggleForm()">Log in</a>';
            }
        }

        // 3. Handle Form Submission (Simulate Login)
        function handleLogin(e) {
            e.preventDefault();
            const btn = e.target.querySelector('.btn-primary');
            const originalText = btn.innerText;
            
            // Loading State
            btn.innerText = "Authenticating...";
            btn.style.opacity = "0.8";

            // Simulate server delay
            setTimeout(() => {
                // Hide login view and show dashboard
                const loginView = document.getElementById('login-view');
                const dashboardApp = document.getElementById('dashboard-app');
                
                if (loginView) {
                    loginView.classList.add('hidden');
                }
                if (dashboardApp) {
                    dashboardApp.classList.remove('hidden');
                }
                
                // Remove login-active class from body to restore dashboard styles
                document.body.classList.remove('login-active');
                
                // Reset button state
                btn.innerText = originalText;
                btn.style.opacity = "1";
            }, 1000);
        }
        
        // Add login-active class to body when page loads (if login view is visible)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                const loginView = document.getElementById('login-view');
                if (loginView && !loginView.classList.contains('hidden')) {
                    document.body.classList.add('login-active');
                }
            });
        } else {
            // DOM already loaded
            const loginView = document.getElementById('login-view');
            if (loginView && !loginView.classList.contains('hidden')) {
                document.body.classList.add('login-active');
            }
        }