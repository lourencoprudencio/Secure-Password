const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const resultMessage = document.getElementById("resultMessage");
const copyBtn = document.getElementById("copyBtn");
const successMessage = document.getElementById("successMessage");
const criteriaListItems = document.querySelectorAll("#criteriaList li");
const charCounter = document.getElementById("charCounter");

passwordInput.addEventListener("input", () => {
    charCounter.textContent = `${passwordInput.value.length} caracteres`;
    checkPasswordCriteria();
});

function updateCharCounter() {
    const characterCount = passwordInput.value.length;
    const isEnglish = languageToggle.checked;
    charCounter.textContent = `${characterCount} ${isEnglish ? 'characters' : 'caracteres'}`;
}

function checkPasswordCriteria() {
    const password = passwordInput.value;
    const username = usernameInput.value;

    const lengthValid = password.length >= 14;
    toggleCriteria("length", lengthValid);

    const specialValid = /[@#%&?!]/.test(password);
    toggleCriteria("special", specialValid);

    const letterValid = /[a-zA-Z]/.test(password);
    toggleCriteria("letter", letterValid);

    const numberValid = /\d/.test(password);
    toggleCriteria("number", numberValid);

    const upperLowerValid = /[A-Z]/.test(password) && /[a-z]/.test(password);
    toggleCriteria("uppercase", upperLowerValid);

    const noNameIncluded = !containsSequentialLetters(username, password);
    toggleCriteria("noName", noNameIncluded);

    const noCommonSeq = !/(123|abc|password|qwerty|asdf)/i.test(password);
    toggleCriteria("noCommonSequences", noCommonSeq);
}

function containsSequentialLetters(input, password) {
    const inputLower = input.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    const passwordLower = password.toLowerCase();

    return inputLower.split('').some((_, index) => {
        const part = inputLower.slice(index, index + 2);
        return passwordLower.includes(part);
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
    }).catch(err => {
        resultMessage.textContent = getMessage("copyError");
    });
});

// Language Toggle
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");

languageToggle.addEventListener('change', function() {
    const isEnglish = languageToggle.checked;
    updateLanguage(isEnglish);
});

function updateLanguage(isEnglish) {
    if (isEnglish) {
        document.querySelector('h1').textContent = 'NOVA Secure Password';
        document.querySelector('input[type="text"]').placeholder = 'Enter your name';
        document.querySelector('input[type="password"]').placeholder = 'Enter a password';
        document.getElementById('checkBtn').textContent = 'Check';
        copyBtn.textContent = 'Copy Password';
        languageLabel.textContent = 'Português';

        document.getElementById('length').textContent = '🔴 At least 14 characters';
        document.getElementById('special').textContent = '🔴 At least one special character (e.g.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contains at least one letter';
        document.getElementById('number').textContent = '🔴 At least one number';
        document.getElementById('uppercase').textContent = '🔴 Includes uppercase and lowercase letters';
        document.getElementById('noName').textContent = '🔴 Must not contain sequences of letters from the entered name';
        document.getElementById('noCommonSequences').textContent = '🔴 Avoid common sequences (e.g.: 123, ABC)';
        document.getElementById('note').innerHTML = '<strong>Note:</strong> 👀Avoid using previous similar passwords.';
        document.getElementById('note').innerHTML = '<strong>Note:</strong> 👀Avoid using previous similar passwords.<br>📅Avoid using dates associated with yourself (e.g., birth, start of contract).';
        updateCharCounter();
    } else {
        document.querySelector('h1').textContent = 'NOVA Password Segura';
        document.querySelector('input[type="text"]').placeholder = 'Escreva o seu nome';
        document.querySelector('input[type="password"]').placeholder = 'Escolha uma password';
        document.getElementById('checkBtn').textContent = 'Verificar';
        copyBtn.textContent = 'Copiar Password';
        languageLabel.textContent = 'English';

        document.getElementById('length').textContent = '🔴 Pelo menos 14 caracteres';
        document.getElementById('special').textContent = '🔴 Pelo menos um caractere especial (ex.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contém pelo menos uma letra';
        document.getElementById('number').textContent = '🔴 Pelo menos um número';
        document.getElementById('uppercase').textContent = '🔴 Inclui letras maiúsculas e minúsculas';
        document.getElementById('noName').textContent = '🔴 Não pode conter sequências de letras do nome inserido';
        document.getElementById('noCommonSequences').textContent = '🔴 Evite sequências comuns (ex.: 123, ABC)';
        document.getElementById('note').innerHTML = '<strong>Nota:</strong> 👀Evite usar passwords semelhantes às anteriores.';
        document.getElementById('note').innerHTML = '<strong>Nota:</strong> 👀Evite usar passwords semelhantes às anteriores.<br>📅Evite usar datas associadas a si (ex.: Nascimento, início de contrato).';
        updateCharCounter();
    }
}

function getMessage(key) {
    const messages = {
        validPassword: languageToggle.checked ? '✅ Valid password! All criteria met.' : '✅ Password válida! Todos os critérios estão completos.',
        invalidPassword: languageToggle.checked ? '❌Password does not meet all criteria.' : '❌ A password não cumpre todos os critérios.',
        copiedPassword: languageToggle.checked ? '🗒️ Password copied!' : '🗒️ Password copiada!',
        copyError: languageToggle.checked ? 'Failed to copy password.' : 'Erro ao copiar a password.',
        successMessage: languageToggle.checked ? '🎉 congratulations, the password is valid! 🎉' : '🎉 PARABÉNS, a password é válida! 🎉'
    };
    return messages[key];
}