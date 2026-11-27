// Outils partagés des parcours Playwright.
import { expect, type Page } from '@playwright/test';

export const etat = (p: Page) => p.evaluate(() => window.__kevlegende!.etat());

export async function surveillerErreurs(p: Page): Promise<string[]> {
  const erreurs: string[] = [];
  p.on('pageerror', (e) => erreurs.push(String(e)));
  p.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('fonts.g')) erreurs.push(m.text());
  });
  return erreurs;
}

/** Nouvelle partie depuis l'écran titre, en touchant l'écran comme un joueur jusqu'à pouvoir marcher. */
export async function nouvellePartie(p: Page): Promise<void> {
  await p.goto('/');
  await p.evaluate(() => localStorage.clear());
  await p.reload();
  await p.getByRole('button', { name: 'Nouvelle partie' }).click();
  for (let i = 0; i < 80; i++) {
    const s = await etat(p);
    if (s.mode === 'exploration' && s.attente === null) break;
    if (await p.locator('.carton:not(.cache)').isVisible()) await p.locator('.carton').click();
    else if (await p.locator('.choix-btn').first().isVisible()) await p.locator('.choix-btn').first().click();
    else if (await p.locator('.dialogue-boite').isVisible()) await p.locator('.dialogue-boite').click();
    await p.waitForTimeout(120);
  }
  await expect.poll(async () => (await etat(p)).mode).toBe('exploration');
}

/** Fait défiler dialogues et choix (premier choix) jusqu'au retour à l'exploration. */
export async function finirDialogues(p: Page, max = 60): Promise<void> {
  for (let i = 0; i < max; i++) {
    const s = await etat(p);
    if (s.attente === null) return;
    if (s.attente === 'choix') await p.locator('.choix-btn').first().click();
    else if (s.attente === 'dit') await p.locator('.dialogue-boite').click();
    else if (s.attente === 'titre') await p.locator('.carton').click();
    else return;
    await p.waitForTimeout(80);
  }
}
