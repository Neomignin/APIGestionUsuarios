import { deleteUserById, findUserById, getUsers, saveNewUser, updateUserInDb } from "../models/userModel.js";
import { DeleteResult } from "../types/DeleteResult.js";
import { User } from "../types/User.js";


export async function newUser(user: User):Promise<string>{
    try {
        const result = await saveNewUser(user);
        return result;
    } catch (error:any){//TODO: quitar el any
        if (error.code === "23505") {
            const columnMatch = error.detail.match(/Key \((.*?)\)=/);
            const columnName = columnMatch ? columnMatch[1] : 'campo';
            return `El ${columnName} ya existe en la base de datos`;
        }
        return error;
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
                message: result.message
            };
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Error al actualizar el usuario'
        };
    }
}