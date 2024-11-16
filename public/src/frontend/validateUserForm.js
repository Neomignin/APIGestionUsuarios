var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FormValidator from "../backend/utils/FormValidator.js";
document.addEventListener("DOMContentLoaded", () => {
    const validator = new FormValidator("userForm");
    const form = document.getElementById("userForm");
    if (form) {
        form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            const formData = new FormData(form);
            const response = yield fetch(form.action, {
                method: form.method,
                body: formData,
            });
            if (response.ok) {
                window.location.href = 'index.html';
            }
            else {
                console.error("Error al registrar el usuario");
            }
        }));
    }
});
