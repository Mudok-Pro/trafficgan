"use server";

import prisma from '@/lib/prisma';

export async function submitDemoRequest(formData: any, selectedServices: string[]) {
    try {
        const inquiry = await prisma.inquiry.create({
            data: {
                name: formData.name,
                email: formData.email,
                organization: formData.organization,
                city: formData.city,
                inquiryType: formData.inquiryType,
                message: formData.message,
                services: selectedServices,
            },
        });

        return { success: true, data: inquiry };
    } catch (error: any) {
        console.error("Database Error:", error);
        return { success: false, error: error.message || "Failed to submit request" };
    }
}