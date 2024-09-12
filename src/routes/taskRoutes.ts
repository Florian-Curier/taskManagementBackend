import express, { Request, Response } from 'express';
import { Task, ITask } from '../models/task';
import mongoose from 'mongoose'

const router = express.Router();

// Ajouter une tâche
router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, UserId, description, completed } = req.body;
        if (!title || !UserId) {
            return res.status(400).json({ message: 'Title and UserId are required' });
        }
        const task = new Task({ title, UserId, description, completed });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error adding task', error });
    }
});

// Mettre à jour une tâche
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Obtenir toutes les tâches
router.get('/', async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
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
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

//Permet de basculer la tache en tache complétée ou non complétée
router.patch('/:id/toggle', async (req: Request, res: Response) => {
    const { id } = req.params

    //Vérifier si l'identifiant est un ObjectId valide 
if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task ID'})
}


    try {
        const task = await Task.findById(id)
        if (!task) {
            return res.status(404).json({ message: 'Task not found'})
        }
        task.completed = !task.completed 
        await task.save()
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: 'Error toggling task', error})
    }
})

export default router;