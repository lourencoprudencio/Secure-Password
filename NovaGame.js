const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const birthdateInput = document.getElementById("birthdate");
const resultMessage = document.getElementById("resultMessage");
const copyBtn = document.getElementById("copyBtn");
const successMessage = document.getElementById("successMessage");
const criteriaListItems = document.querySelectorAll("#criteriaList li");

passwordInput.addEventListener("input", checkPasswordCriteria);

function checkPasswordCriteria() {
    const password = passwordInput.value;
    const username = usernameInput.value;
    const birthdate = birthdateInput.value;

    console.log("Checking password criteria...");
    
    const lengthValid = password.length >= 14;
    console.log(`Length valid: ${lengthValid}`);
    toggleCriteria("length", lengthValid);

    const specialValid = /[@#%&?!]/.test(password);
    console.log(`Special character valid: ${specialValid}`);
    toggleCriteria("special", specialValid);

    const letterValid = /[a-zA-Z]/.test(password);
    console.log(`Letter valid: ${letterValid}`);
    toggleCriteria("letter", letterValid);

    const numberValid = /\d/.test(password);
    console.log(`Number valid: ${numberValid}`);
    toggleCriteria("number", numberValid);

    const upperLowerValid = /[A-Z]/.test(password) && /[a-z]/.test(password);
    console.log(`Upper and lower case valid: ${upperLowerValid}`);
    toggleCriteria("uppercase", upperLowerValid);

    const noNameIncluded = !containsSequentialLetters(username, password);
    console.log(`No name included: ${noNameIncluded}`);
    toggleCriteria("noName", noNameIncluded);

    const noCommonSeq = !/(123|abc|password|qwerty|asdf)/i.test(password);
    console.log(`No common sequences valid: ${noCommonSeq}`);
    toggleCriteria("noCommonSequences", noCommonSeq);

    const noBirthdateIncluded = !containsSequentialLetters(birthdate, password);
    console.log(`No birthdate included: ${noBirthdateIncluded}`);
    toggleCriteria("noBirthdate", noBirthdateIncluded);
}

function containsSequentialLetters(input, password) {
    const inputLower = input.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    const passwordLower = password.toLowerCase();

    console.log(`Checking sequential letters for input: ${inputLower} against password: ${passwordLower}`);
    
    return inputLower.split('').some((_, index) => {
        const part = inputLower.slice(index, index + 2);
        const containsPart = passwordLower.includes(part);
        console.log(`Checking part: ${part}, contains: ${containsPart}`);
        return containsPart;
    });
}

function toggleCriteria(id, isValid) {
    const criteriaItem = document.getElementById(id);
    if (isValid) {
        criteriaItem.classList.add("completed");
        criteriaItem.textContent = criteriaItem.textContent.replace("🔴", "🟢");
    } else {
        criteriaItem.classList.remove("completed");
        criteriaItem.textContent = criteriaItem.textContent.replace("🟢", "🔴");
    }
}

document.getElementById("checkBtn").addEventListener("click", () => {
    const checks = Array.from(criteriaListItems);
    const allPass = checks.every(check => check.classList.contains("completed"));

    console.log(`All criteria passed: ${allPass}`);

    if (allPass) {
        resultMessage.textContent = getMessage("validPassword");
        successMessage.textContent = getMessage("successMessage");
        successMessage.style.display = "block";
        successMessage.classList.add("animate");
        copyBtn.style.display = "block";
    } else {
        resultMessage.textContent = getMessage("invalidPassword");
        successMessage.style.display = "none";
        copyBtn.style.display = "none";
    }
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        resultMessage.textContent = getMessage("copiedPassword");
        console.log("Password copied successfully.");
    }).catch(err => {
        resultMessage.textContent = getMessage("copyError");
        console.error("Error copying password:", err);
    });
});

// Language Toggle
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");

languageToggle.addEventListener('change', function() {
    const isEnglish = languageToggle.checked;
    console.log(`Language toggled: ${isEnglish ? 'English' : 'Português'}`);
    updateLanguage(isEnglish);
});

function updateLanguage(isEnglish) {
    if (isEnglish) {
        document.querySelector('h1').textContent = 'NOVA Secure Password';
        document.querySelector('input[type="text"]').placeholder = 'Enter your name';
        document.querySelector('input[type="password"]').placeholder = 'Enter a password';
        document.getElementById('checkBtn').textContent = 'Check';
        copyBtn.textContent = 'Copy Password'; // Adicionei a tradução do botão
        languageLabel.textContent = 'Português';

        // Criteria
        document.getElementById('length').textContent = '🔴 At least 14 characters';
        document.getElementById('special').textContent = '🔴 At least one special character (e.g.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contains at least one letter';
        document.getElementById('number').textContent = '🔴 At least one number';
        document.getElementById('uppercase').textContent = '🔴 Includes uppercase and lowercase letters';
        document.getElementById('noName').textContent = '🔴 Must not contain sequences of letters from the entered name';
        document.getElementById('noCommonSequences').textContent = '🔴 Avoid common sequences (e.g.: 123, ABC)';
        document.getElementById('noBirthdate').textContent = '🔴 Must not contain sequences of the birthdate';
        document.getElementById('note').innerHTML = '<strong>Note:</strong> 👀Avoid using previous similar passwords.';
    } else {
        document.querySelector('h1').textContent = 'NOVA Password Segura';
        document.querySelector('input[type="text"]').placeholder = 'Escreva o seu nome';
        document.querySelector('input[type="password"]').placeholder = 'Escolha uma password';
        document.getElementById('checkBtn').textContent = 'Verificar';
        copyBtn.textContent = 'Copiar Password'; // Adicionei a tradução do botão
        languageLabel.textContent = 'English';

        // Criteria
        document.getElementById('length').textContent = '🔴 Pelo menos 14 caracteres';
        document.getElementById('special').textContent = '🔴 Pelo menos um caractere especial (ex.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contém pelo menos uma letra';
        document.getElementById('number').textContent = '🔴 Pelo menos um número';
        document.getElementById('uppercase').textContent = '🔴 Inclui letras maiúsculas e minúsculas';
        document.getElementById('noName').textContent = '🔴 Não pode conter sequências de letras do nome inserido';
        document.getElementById('noCommonSequences').textContent = '🔴 Evite sequências comuns (ex.: 123, ABC)';
        document.getElementById('noBirthdate').textContent = '🔴 Não pode conter sequências da data de nascimento';
        document.getElementById('note').innerHTML = '<strong>Nota:</strong> 👀Evite usar passwords semelhantes às anteriores.';
    }
}

function getMessage(key) {
    const messages = {
        validPassword: languageToggle.checked ? "Valid password!" : "Password válida!",
        invalidPassword: languageToggle.checked ? "Password does not meet all criteria!" : "A password não corresponde a todos os critérios!",
        successMessage: languageToggle.checked ? "🎉 congratulations, the password is valid! 🎉" : "🎉 PARABÉNS, a password é válida! 🎉",
        copiedPassword: languageToggle.checked ? "Password copied to clipboard!" : "Password copiada para a área de transferência!",
        copyError: languageToggle.checked ? "Error copying password." : "Erro ao copiar a password."
    };
    console.log(`Getting message for key: ${key}`);
    return messages[key];
}