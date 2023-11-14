// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initially hide the copy button
    document.getElementById('copy-button').style.display = 'none';

    document.getElementById('formulaGeneratorForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const dataCenterURL = document.getElementById('dataCenterUrl').value;
        const tabName = document.querySelector('input[name="tabName"]:checked').value;
        const includeFolder = document.getElementById('includeFolder').value;
        const excludeFoldersValue = document.getElementById('excludeFolders').value;
        const excludeFolders = excludeFoldersValue ? excludeFoldersValue.split(',') : [];

        const formula = generateFormula(dataCenterURL, tabName, includeFolder, excludeFolders);

        // Display the formula
        document.getElementById('output-area').textContent = formula;

        // Show the copy button
        document.getElementById('copy-button').style.display = 'block';
      
    });

    document.getElementById('copy-button').addEventListener('click', function() {
        const formula = document.getElementById('output-area').textContent;
        if (formula) {
            navigator.clipboard.writeText(formula).then(() => {
                alert('Formula copied to clipboard!');
            }).catch(err => {
                console.error('Error in copying text: ', err);
            });
        }
    });
});

function generateFormula(dataCenterURL, tabName, includeFolder, excludeFolders) {
    let formula = `=SORT(FILTER(IMPORTRANGE("${dataCenterURL}", "${tabName}!A:A"), `;
    
    // Include condition
    if (includeFolder) {
        formula += `ISNUMBER(SEARCH("${includeFolder}", IMPORTRANGE("${dataCenterURL}", "${tabName}!A:A")))`;
    }

    // Exclude conditions
    excludeFolders.forEach((folder, index) => {
        const trimmedFolder = folder.trim();
        if (trimmedFolder) {
            formula += `, NOT(ISNUMBER(SEARCH("${trimmedFolder}", IMPORTRANGE("${dataCenterURL}", "${tabName}!A:A"))))`;
        }
    });

    formula += `), 1, TRUE)`;

    return formula;
}
