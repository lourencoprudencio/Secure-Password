// https://github.com/lourencoprudencio/NOVA-Secure-Password

// Função para tratar tentativas de utilizar caracteres comuns em ataques XSS e evitar ataques
function escapeHtml(input) {
    console.log("Texto a ser tratado escapeHtml:", input);  // Console log do texto a ser tratado
    var element = document.createElement('div');
    if (input) {
        element.innerText = input;
        element.textContent = input;
    }
    const escapedText = element.innerHTML;  // Retorna o texto tratado
    console.log("Texto tratado:", escapedText);  // Console log do texto depois de tratado
    return escapedText;
}

// Seleciona os elementos do HTML pelos seus IDs
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const resultMessage = document.getElementById("resultMessage");
const copyBtn = document.getElementById("copyBtn");
const successMessage = document.getElementById("successMessage");
const criteriaListItems = document.querySelectorAll("#criteriaList li");
const charCounter = document.getElementById("charCounter");
const generatePasswordBtn = document.getElementById("generatePasswordBtn");
const funFact = document.getElementById("funFact");

// Evento de clicar no botão de gerar password
generatePasswordBtn.addEventListener("click", () => {
    generatePassword(); // Vai buscar a função para gerar a nova password
    showFunFact(); // Vai buscar a função para mostrar um Fun Fact
});

// Função para gerar uma password segura
function generatePassword() {
    const length = 14; // Comprimento da password

    // Diferentes tipos de caracteres a serem usados
    const specialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
    const numbers = "0123456789";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    let password = "";

    // Adiciona pelo menos um caractere de cada tipo
    password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
    password += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];

    // Preenche o restante da password com caracteres aleatórios
    const allCharacters = specialCharacters + numbers + lowercaseLetters + uppercaseLetters;
    while (password.length < length) {
        password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    // Baralha a password gerada
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    // Atualiza o campo da password com a nova password
    passwordInput.value = password;
    updateCharCounter(); // Atualiza o contador de caracteres
    checkPasswordCriteria(); // Verifica se a password cumpre os critérios
}

// Atualiza o contador de caracteres quando o utilizador escrever a password
passwordInput.addEventListener("input", () => {
    charCounter.textContent = `${passwordInput.value.length} caracteres`;
    checkPasswordCriteria();
});

// Atualizar o contador de caracteres de acordo com o idioma selecionado
function updateCharCounter() {
    const characterCount = passwordInput.value.length;
    const isEnglish = languageToggle.checked;
    charCounter.textContent = `${characterCount} ${isEnglish ? 'characters' : 'caracteres'}`;
}

// Verifica se a password atende a todos os critérios
function checkPasswordCriteria() {
    const password = passwordInput.value;
    const username = usernameInput.value;

    // Escapa o nome do usuário para evitar XSS
    const sanitizedUsername = escapeHtml(username);

    // Verifica se a password tem pelo menos 14 caracteres
    const lengthValid = password.length >= 14;
    toggleCriteria("length", lengthValid);

    // Verifica se a password contém pelo menos um caractere especial
    const specialValid = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/s.test(password);
    toggleCriteria("special", specialValid);

    // Verifica se a password contém pelo menos uma letra
    const letterValid = /[a-zA-Z]/.test(password);
    toggleCriteria("letter", letterValid);

    // Verifica se a password contém pelo menos um número
    const numberValid = /\d/.test(password);
    toggleCriteria("number", numberValid);

    // Verifica se a password contém letras maiúsculas e minúsculas
    const upperLowerValid = /[A-Z]/.test(password) && /[a-z]/.test(password);
    toggleCriteria("uppercase", upperLowerValid);

    // Verifica se a password não contém partes do nome
    const noNameIncluded = !containsSequentialLetters(sanitizedUsername, password);
    toggleCriteria("noName", noNameIncluded);

    // Verifica se a password não contém sequências comuns
    const noCommonSeq = !/(123|abc|password|qwerty|asdf)/i.test(password);
    toggleCriteria("noCommonSequences", noCommonSeq);
}

// Verifica se o nome do está contido na password
function containsSequentialLetters(input, password) {
    const inputLower = input.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    const passwordLower = password.toLowerCase();

    return passwordLower.includes(inputLower);
}

// Alternar o estado visual dos critérios
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

// Botão de verificar a password
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

// Copiar a password para a área de transferência
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(passwordInput.value).then(() => {
        resultMessage.textContent = getMessage("copiedPassword");
    }).catch(err => {
        resultMessage.textContent = getMessage("copyError");
    });
});

// Alterna o idioma entre inglês e português
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");

languageToggle.addEventListener('change', function() {
    const isEnglish = languageToggle.checked;
    updateLanguage(isEnglish);
});

//Critérios, textos e botões em inglês
function updateLanguage(isEnglish) {
    if (isEnglish) {
        document.querySelector('h1').textContent = 'NOVA Secure Password';
        document.querySelector('input[type="text"]').placeholder = 'Enter your first name';
        document.querySelector('input[type="password"]').placeholder = 'Enter a password';
        document.getElementById('checkBtn').textContent = 'Check';
        copyBtn.textContent = 'Copy Password';
        languageLabel.textContent = 'Português';

        document.getElementById('length').textContent = '🔴 At least 14 characters';
        document.getElementById('special').textContent = '🔴 At least one special character (e.g.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contains at least one letter';
        document.getElementById('number').textContent = '🔴 At least one number';
        document.getElementById('uppercase').textContent = '🔴 Includes uppercase and lowercase letters';
        document.getElementById('noName').textContent = '🔴 It must not contain parts of your name';
        document.getElementById('noCommonSequences').textContent = '🔴 Avoid common sequences (e.g.: 123, ABC)';
        document.getElementById('note').innerHTML = '<strong>Note:</strong> 👀Avoid using previous similar passwords.';
        document.getElementById('note').innerHTML = '<strong>Note:</strong> 👀Avoid using previous similar passwords.<br>📅Avoid using dates associated with yourself (e.g., birth, start of contract).<br>🔑Always use two-factor authentication (e.g.: Microsoft Authenticator, Google Authenticator)';
        document.getElementById('generatePasswordBtn').textContent = 'Generate Password';
        document.getElementById('instruction').textContent = "Don't know what password to choose? Enter your name click on 'Generate password' and then 'Check'.";
        updateCharCounter();

    //Critérios, textos e botões em português
    } else {
        document.querySelector('h1').textContent = 'NOVA Password Segura';
        document.querySelector('input[type="text"]').placeholder = 'Escreva o seu primeiro nome';
        document.querySelector('input[type="password"]').placeholder = 'Escolha uma password';
        document.getElementById('checkBtn').textContent = 'Verificar';
        copyBtn.textContent = 'Copiar Password';
        languageLabel.textContent = 'English';

        document.getElementById('length').textContent = '🔴 Pelo menos 14 caracteres';
        document.getElementById('special').textContent = '🔴 Pelo menos um caractere especial (ex.: @, #, %, &, ?, !)';
        document.getElementById('letter').textContent = '🔴 Contém pelo menos uma letra';
        document.getElementById('number').textContent = '🔴 Pelo menos um número';
        document.getElementById('uppercase').textContent = '🔴 Inclui letras maiúsculas e minúsculas';
        document.getElementById('noName').textContent = '🔴 Não deve conter partes do seu nome';
        document.getElementById('noCommonSequences').textContent = '🔴 Evite sequências comuns (ex.: 123, ABC)';
        document.getElementById('note').innerHTML = '<strong>Nota:</strong> 👀Evite usar passwords semelhantes às anteriores.';
        document.getElementById('note').innerHTML = '<strong>Nota:</strong> 👀Evite usar passwords semelhantes às anteriores.<br>📅Evite usar datas associadas a si (ex.: Nascimento, início de contrato).<br>🔑Utilize sempre autenticação de 2 fatores (ex.: Microsoft Autenticator, Google Autenticator).';
        document.getElementById('generatePasswordBtn').textContent = 'Gerar Password';
        document.getElementById('instruction').textContent = "Não sabe que password escolher? Insira o seu nome Clique em 'Gerar password' e depois 'Verificar'.";
        updateCharCounter();
    }
}

//Mostrar o fun fact APENAS PARA PASSWORDS GERADAS
function showFunFact() {
    const isEnglish = languageToggle.checked;
    const funFactsList = isEnglish ? funFactsListEn : funFactsListPt;
    const randomFact = funFactsList[Math.floor(Math.random() * funFactsList.length)];
    funFact.textContent = randomFact;
    funFact.style.display = "block";
}

//Fun facts em português APENAS PARA PASSWORDS GERADAS
const funFactsListPt = [
    "🚀 As passwords geradas são tão seguras que um hacker precisaria do tempo necessário para ir e voltar da lua mais de 1.300 vezes para adivinhar!",
    "🔐 Sabia que uma password segura com 14 caracteres é mais forte do que 99% das passwords usadas atualmente?",
    "🛡️ Com esta password, até o supercomputador mais rápido do mundo levaria anos para a decifrar.",
    "🧩 As combinações possíveis para uma password como esta são superiores a 10^18. Isso é mais do que o número de grãos de areia na Terra!",
    "💡 Uma password segura é como uma chave mágica que mantém os seus dados seguros — e esta aqui é digna de um cofre!"
];

//Fun Facts em inglês APENAS PARA PASSWORDS GERADAS

const funFactsListEn = [
    "🚀 The generated passwords are so secure that a hacker would need the time it takes to travel to the moon and back over 1,300 times to guess it!",
    "🔐 Did you know a secure password with 14 characters is stronger than 99% of passwords used today?",
    "🛡️ With this password, even the fastest supercomputer in the world would take years to crack it.",
    "🧩 The possible combinations for a password like this exceed 10^18. That's more than the number of grains of sand on Earth!",
    "💡 A secure password is like a magic key that keeps your data safe — and this one is worthy of a vault!"
];

//Mesagens de aviso em português e inglês
function getMessage(key) {
    const messages = {
        validPassword: languageToggle.checked ? '✅ Valid password! All criteria met.' : '✅ Password válida! Todos os critérios estão completos.',
        invalidPassword: languageToggle.checked ? '❌Password does not meet all criteria.' : '❌ A password não cumpre todos os critérios.',
        copiedPassword: languageToggle.checked ? '🗒️ Password copied!' : '🗒️ Password copiada!',
        copyError: languageToggle.checked ? 'Failed to copy password.' : 'Erro ao copiar a password.',
        successMessage: languageToggle.checked ? '🎉 Congratulations, the password is valid! ' : '🎉 Parabéns, a password é válida! '
    };
    return messages[key];
}
