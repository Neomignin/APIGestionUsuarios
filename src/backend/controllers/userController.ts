import { deleteUserById, findUserById, getUsers, saveNewUser, updateUserInDb } from "../models/userModel.js";
import { DeleteResult } from "../types/DeleteResult.js";
import { User } from "../types/User.js";

interface UserResponse {
    success: boolean;
    message?: string;
    user?: User;
}

export async function newUser(user: User): Promise<UserResponse> {
    try {
        const result = await saveNewUser(user);
        if ('success' in result && !result.success) {
            return {
                success: false,
                message: result.message
            };
        }
        return {
            success: true,
            message: "Usuario creado correctamente",
            user: result
        };
    } catch (error: any) {
        if (error.code === "23505") {
            const columnMatch = error.detail.match(/Key \((.*?)\)=/);
            const columnName = columnMatch ? columnMatch[1] : 'campo';
            return {
                success: false,
                message: `El ${columnName} ya existe en la base de datos`
            };
        }
        return {
            success: false,
            message: error.message || "Error al crear el usuario"
        };
    }
}

export async function getAllUsers():Promise<string>{
    const result = await getUsers();
    return result;
}

export async function getUser(id:string):Promise<string>{
    const result = await findUserById(id);
    return result;
}

export async function deleteUser(id:string):Promise<DeleteResult>{
    const result = await deleteUserById(id);
    return result;
}

export async function updateUser(id: string, user: User): Promise<any> {
    try {
        const result = await updateUserInDb(id, user);
        if (result.success) {
            return {
                success: true,
                message: result.message,
                user: result.user
            };
        } else {
            return {
                success: false,
                message: result.message || 'Error al actualizar el usuario'
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Error al actualizar el usuario'
        };
    }
}