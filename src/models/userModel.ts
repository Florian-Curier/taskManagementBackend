import mongoose, { Document } from 'mongoose';

//Interface pour les utilisateurs 
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

//Schema de l'utilisateur 
const UserSchema = new mongoose.Schema({
    name: { type:String, required:true},
    email: { type:String, required: true, unique:true },
    password: { type:String, required:true }    
})

//Export du modèle User 
export const User = mongoose.model<IUser>('User', UserSchema);