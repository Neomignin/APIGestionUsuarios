import Express from 'express';
import { User } from '../types/User.js';
import { deleteUser, getAllUsers, getUser, newUser, updateUser } from '../controllers/userController.js';
import { validateNumericParams } from '../middlewares/validateNumericParams.js';
import { DeleteResult } from '../types/DeleteResult.js';

const userRouter = Express.Router();

userRouter.get("/", async (req: Express.Request, res: Express.Response) => {
    const result = await getAllUsers();
    res.json(result);
  });
  
userRouter.get("/:id", validateNumericParams, async (req: Express.Request, res: Express.Response) => {
    const user = await getUser(req.params.id);
    res.send(user);
  });
 
userRouter.post("/", async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
        const user: User = {
            userName: req.body.username,
            name: req.body.name,
            first_surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        };

        if (!user.userName || !user.name || !user.first_surname || !user.email || !user.password) {
            res.status(400).json({ 
                success: false,
                message: "Todos los campos son requeridos." 
            });
            return;
        }

        const result = await newUser(user);
        
        if (!result.success) {
            res.status(400).json({
                success: false,
                message: result.message || "Error al crear el usuario"
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: "Usuario creado correctamente",
            user: result.user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Error interno del servidor"
        });
    }
});

userRouter.delete("/:id", validateNumericParams, async (req: Express.Request, res: Express.Response) => {  
    const result: DeleteResult = await deleteUser(req.params.id);
    let statusCode=200;
    if(!result.success && result.rowsAffected==0) statusCode=404;
    if(!result.success && !("rowsAffected" in result)) statusCode=500;
    res.status(statusCode).json({message: result.message});
});

userRouter.put("/:id", validateNumericParams, async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
        const requiredFields = ['userName', 'name', 'first_surname', 'email'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: `Faltan campos requeridos: ${missingFields.join(', ')}`
            });
            return;
        }

        const user: User = {
            userName: req.body.userName,
            name: req.body.name,
            first_surname: req.body.first_surname,
            email: req.body.email,
            password: req.body.password 
        };

        const result = await updateUser(req.params.id, user);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al actualizar el usuario'
        });
    }
});

export default userRouter;