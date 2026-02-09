
'use server';

import { createClient } from '@/utils/supabase/server';
import { isAdmin } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function updateLyrics(songId: string, contentEn: string, contentJa: string) {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Unauthorized');
    }

    if (!isAdmin(user.id)) {
        throw new Error('Forbidden: Admin access required');
    }

    const { error } = await supabase
        .from('lyrics')
        .upsert({
            song_id: songId,
            content_en: contentEn,
            content_ja: contentJa,
            // Keep created_by system or null potentially, or update it if schema supports updated_by
            // For upsert, we just update the content.
        })
        .select();

    if (error) {
        console.error('Error updating lyrics:', error);
        throw new Error('Failed to update lyrics');
    }

    revalidatePath(`/songs/${songId}`); // Refresh the song page
    revalidatePath('/songs'); // Refresh list if snippets are shown
}
