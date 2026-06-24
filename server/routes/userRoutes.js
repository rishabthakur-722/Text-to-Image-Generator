import express from 'express'
import { userCredits } from '../controllers/userController.js'
import userAuth from '../middlewares/userAuth.js'

const userRouter = express.Router()

userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/credits', userAuth, userCredits)

export default userRouter
