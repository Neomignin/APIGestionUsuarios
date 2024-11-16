import pool from "../config/configDb.js";
import { DeleteResult } from "../types/DeleteResult.js";
import { User } from "../types/User.js";
import { QueryResult } from 'pg';


export async function saveNewUser(user:User):Promise<any>{
    try {
        const queryString = `INSERT INTO "user" ("userName", "name", "first_surname", "password", "email") VALUES ('${user.userName}', '${user.name}', '${user.first_surname}', '${user.password}','${user.email}')`;
        const result = await pool.query(queryString);
        return result.rows;
    } catch (error) {
        return {
            success: false,
            message: `Error al guardar el nuevo usuario: ${(error as Error).message}`
        };
    }
}

export async function getUsers():Promise<any>{  
    try {
        const queryString = `SELECT * FROM "user"`;
        const result = await pool.query(queryString);
        return result.rows;
    } catch (error) {
        return {
            success: false,
            message: `Error al obtener usuarios: ${(error as Error).message}`
        };
    }
}

export async function findUserById(id:string):Promise<any>{
    try {
        const queryString = `SELECT * FROM "user" WHERE "id" = ${id}`;
        const result = await pool.query(queryString);
        return result.rows;
    } catch (error) {
        return {
            success: false,
            message: `Error al encontrar el usuario: ${(error as Error).message}`
        };
    }
}

export async function deleteUserById(id: string): Promise<DeleteResult> {
    try {
        const queryString = `DELETE FROM "user" WHERE "id" = ${id}`;
        const result = await pool.query(queryString);
        
        if (result.rowCount && result.rowCount > 0) {
            return {
                success: true,
                message: 'Usuario eliminado correctamente',
                rowsAffected: result.rowCount
            };
        } else {
            return {
                success: false,
                message: 'No se encontró el usuario',
                rowsAffected: 0
            };
        }
    } catch (error) {
        return {
            success: false,
            message: `Error al eliminar usuario: ${(error as Error).message}`
        };
    }
}

export async function updateUserInDb(id: string, user: Partial<User>): Promise<any> {
    try {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (user.userName !== undefined) {
            updates.push(`"userName" = $${paramCount}`);
            values.push(user.userName);
            paramCount++;
        }
        if (user.name !== undefined) {
            updates.push(`"name" = $${paramCount}`);
            values.push(user.name);
            paramCount++;
        }
        if (user.first_surname !== undefined) {
            updates.push(`"first_surname" = $${paramCount}`);
            values.push(user.first_surname);
            paramCount++;
        }
        if (user.email !== undefined) {
            updates.push(`"email" = $${paramCount}`);
            values.push(user.email);
            paramCount++;
        }
        if (user.password !== undefined) {
            updates.push(`"password" = $${paramCount}`);
            values.push(user.password);
            paramCount++;
        }

        if (updates.length === 0) {
            return {
                success: false,
                message: 'No se proporcionaron campos para actualizar'
            };
        }

        values.push(id);
        const queryString = `
            UPDATE "user" 
            SET ${updates.join(', ')} 
            WHERE "id" = $${paramCount}
            RETURNING *
        `;

        const result: QueryResult = await pool.query(queryString, values);
        
        if (result.rowCount && result.rowCount > 0) {
            return {
                success: true,
                message: 'Usuario actualizado correctamente',
                user: result.rows[0]
            };
        } else {
            return {
                success: false,
                message: 'No se encontró el usuario'
            };
        }
    } catch (error) {
        if ((error as any).code === '23505') {
            return {
                success: false,
                message: 'El email o nombre de usuario ya existe'
            };
        }
        return {
            success: false,
            message: `Error al actualizar usuario: ${(error as Error).message}`
        };
    }
}  