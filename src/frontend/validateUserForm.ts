import FormValidator from "../backend/utils/FormValidator.js";

document.addEventListener("DOMContentLoaded", () => {
    const validator = new FormValidator("userForm");

    const form = document.getElementById("userForm") as HTMLFormElement | null;
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
            });

            if (response.ok) {
                window.location.href = 'index.html';
            } else {
                console.error("Error al registrar el usuario");
            }
        });
    }
});