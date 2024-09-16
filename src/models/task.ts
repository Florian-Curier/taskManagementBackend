import mongoose, { Document } from 'mongoose';

// Interface pour les sous-tâches 
export interface ISubTask {
    title: string;
    completed: boolean;
}

// Interface pour les tâches principales
export interface ITask extends Document {
    _id: string;
    title: string;
    UserId: string;
    description: string;
    completed: boolean;
    priority: 'haute' | 'moyenne' | 'basse';
    dueDate: string;
    subTasks: ISubTask[]; // Ajout du tableau de sous-tâches
}

// Schéma des sous-tâches
const subTaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

// Schéma des tâches principales
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    UserId: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['haute', 'moyenne', 'basse'], required: true },
    dueDate: { type: Date, required: false },
    subTasks: [subTaskSchema] // Ajout du tableau de sous-tâches
});

// Export du modèle Task pour utilisation dans d'autres parties de l'application
export const Task = mongoose.model<ITask>('Task', taskSchema);