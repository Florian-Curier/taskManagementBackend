import express, { Request, Response } from 'express';
import { Task, ITask } from '../models/task';
import mongoose from 'mongoose';

const router = express.Router();

// Ajouter une tâche
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, UserId, description, completed, priority, dueDate } = req.body;
        if (!title || !UserId || !priority) {
            return res.status(400).json({ message: 'Title, UserId, and priority are required' });
        }

        const task = new Task({
            title,
            UserId,
            description, 
            completed,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null // Conversion de la date en objet Date, si elle existe
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(error); // Pour afficher l'erreur dans la console
        res.status(500).json({ message: 'Error adding task', error });
    }
});

// Mettre à jour une tâche
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, UserId, description, completed, priority, dueDate } = req.body;

        if (!title || !UserId || !priority) {
            return res.status(400).json({ message: 'Title, UserId, and priority are required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            {
                title,
                UserId,
                description, // Utilisation de la description
                completed,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null // Conversion de la date en objet Date, si elle existe
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        console.error(error); // Pour afficher l'erreur dans la console
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Obtenir toutes les tâches
router.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error); // Pour afficher l'erreur dans la console
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// Supprimer une tâche
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error); // Pour afficher l'erreur dans la console
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// Permet de basculer la tâche en tâche complétée ou non complétée
router.patch('/:id/toggle', async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error); // Pour afficher l'erreur dans la console
        res.status(500).json({ message: 'Error toggling task', error });
    }
});

//Route pour ajouter une sous-tache 
router.post("/:id/subtask", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        console.log(`Task ID: ${id}, Subtask title: ${title}`);

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.subTasks.push({ title, completed: false });
        await task.save();
        res.status(201).json(task); // Retourner la tâche avec la sous-tâche ajoutée
    } catch (error) {
        console.error(error);

        console.error('Error adding subtask:', error);
        res.status(500).json({ message: 'Error adding subtask', error });
    }
});

router.patch('/:taskId/subtasks/:subTaskIndex/toggle', async (req, res) => {
    const { taskId, subTaskIndex } = req.params;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.subTasks[Number(subTaskIndex)].completed = !task.subTasks[Number(subTaskIndex)].completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling sub-task', error });
    }
});


export default router;