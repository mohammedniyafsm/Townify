import express, { Router } from 'express'
import { adminDashboard, logout, toggleUserStatus } from './admin.controller.js'
import { adminMiddleware } from 'src/shared/middleware/auth.middleware.js'

const router:Router = express.Router()


router.get('/dashboard',adminMiddleware,adminDashboard)
router.patch('/toggle-user/:id',adminMiddleware,toggleUserStatus)
router.post('/logout',adminMiddleware,logout)

export default router