window.onload = function() {
    const passwordField = document.querySelector('#password');
    const characterLength = document.querySelector('#character-length');
    const lowerCase = document.querySelector('#lower-case');
    const upperCase = document.querySelector('#upper-case');
    const specialChar = document.querySelector('#special-character');
    const digit = document.querySelector('#digit');
    const submitButton = document.querySelector('#submit');
    const togglePassword = document.querySelector('#toggle-password');
    
    passwordField.addEventListener('focus', function() {
        characterLength.style.color = 'black';
        lowerCase.style.color = 'black';
        upperCase.style.color = 'black';
        specialChar.style.color = 'black';
        digit.style.color = 'black';
    });
    passwordField.addEventListener('blur', function() {
        characterLength.style.color = 'black';
        lowerCase.style.color = 'black';
        upperCase.style.color = 'black';
        specialChar.style.color = 'black';
        digit.style.color = 'black';
    });
    passwordField.addEventListener('input', function() {
        let lengthValid = (passwordField.value.length >= 8 && passwordField.value.length <= 32);
        let lowerValid = (/[a-z]/.test(passwordField.value));
        let upperValid = (/[A-Z]/.test(passwordField.value));
        let specialValid = (/[*.!@$%^&(){}[\]:;<>,.?/~_+-=|\\]/.test(passwordField.value));
        let digitValid = (/\d/.test(passwordField.value));
        
        if (lengthValid && lowerValid && upperValid && specialValid && digitValid) {
            passwordField.setCustomValidity('');
            characterLength.style.color = 'green';
            lowerCase.style.color = 'green';
            upperCase.style.color = 'green';
            specialChar.style.color = 'green';
            digit.style.color = 'green';
            submitButton.disabled = false;
        } else {
            passwordField.setCustomValidity('Password must meet the following requirements:');
            characterLength.style.color = lengthValid ? 'green' : 'red';
            lowerCase.style.color = lowerValid ? 'green' : 'red';
            upperCase.style.color = upperValid ? 'green' : 'red';
            specialChar.style.color = specialValid ? 'green' : 'red';
            digit.style.color = digitValid ? 'green' : 'red';
            submitButton.disabled = true;
        }
        
        characterLength.textContent = lengthValid ? '✓ Must contain between 8-32 characters' : '✗ Must contain between 8-32 characters';
        lowerCase.textContent = lowerValid ? '✓ Must contain lower case' : '✗ Must contain lower case';
        upperCase.textContent = upperValid ? '✓ Must contain upper case' : '✗ Must contain upper case';
        specialChar.textContent = specialValid ? '✓ Must contain special character' : '✗ Must contain special character';
        digit.textContent = digitValid ? '✓ Must include a digit' : '✗ Must include a digit';
    });

    togglePassword.addEventListener('click', function() {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        } else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
    });
};