"use server";

import prisma from '@/lib/prisma';
import { z } from 'zod';

const inquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().email("Invalid email format"),
    organization: z.string().max(100, "Organization name is too long").optional().or(z.literal('')),
    city: z.string().min(2, "City is required").max(50),
    inquiryType: z.string().min(1, "Please select an inquiry type"),
    message: z.string().max(1000, "Message cannot exceed 1000 characters").optional().or(z.literal('')),
    services: z.array(z.string()).optional(),
});

export async function submitDemoRequest(formData: any, selectedServices: string[]) {
    // 1. safeParse doesn't throw errors, it returns an object with a success boolean
    const validation = inquirySchema.safeParse({
        ...formData,
        services: selectedServices,
    });

    // 2. If validation fails, we intercept it before touching the database
    // 2. If validation fails, we intercept it before touching the database
    if (!validation.success) {
        console.error("Validation failed:", validation.error.issues);
        return { success: false, error: validation.error.issues[0].message };
    }

    // 3. We now have strictly typed, 100% valid data
    const validatedData = validation.data;

    try {
        const inquiry = await prisma.inquiry.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                // The || "" ensures Prisma always gets a string, never undefined
                organization: validatedData.organization || "",
                city: validatedData.city,
                inquiryType: validatedData.inquiryType,
                message: validatedData.message || "",
                services: validatedData.services || [],
            },
        });

        return { success: true, data: inquiry };
    } catch (error: any) {
        console.error("Database Error:", error);
        return { success: false, error: "Failed to submit request. Please try again." };
    }
}