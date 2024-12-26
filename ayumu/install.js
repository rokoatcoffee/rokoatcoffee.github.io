const local_storage_constant = 'ayumu-install-check';
const buttonInstall = document.getElementById('install-btn');
let install_check = localStorage.getItem(local_storage_constant);

if (install_check === null || install_check === false) {
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('beforeinstallprompt', event);
        // Stash the event so it can be triggered later.
        window.deferredPrompt = event;
        // Remove the 'hidden' class from the install button container
        buttonInstall.classList.toggle('hidden', false);
    });

    buttonInstall.addEventListener('click', async () => {
        console.log('buttonInstall-clicked');
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            // The deferred prompt isn't available.
            return;
        }
        // Show the install prompt.
        promptEvent.prompt();
        // Log the result
        const result = await promptEvent.userChoice;
        console.log('userChoice', result);
        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        window.deferredPrompt = null;
        // Hide the install button.
        buttonInstall.classList.toggle('hidden', true);
        localStorage.setItem(local_storage_constant, true);
    });

    window.addEventListener('appinstalled', (event) => {
        console.log('appinstalled', event);
        // Clear the deferredPrompt so it can be garbage collected
        window.deferredPrompt = null;
    });
}
