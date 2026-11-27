// Parcours mobiles : titre, dialogues, déplacement, menu, sauvegarde, boutique, combat, aventure complète.
import { expect, test } from '@playwright/test';
import { etat, finirDialogues, nouvellePartie, surveillerErreurs } from './outils';

test('nouvelle partie : intro, dialogues, puis exploration avec le HUD', async ({ page }) => {
  const erreurs = await surveillerErreurs(page);
  await nouvellePartie(page);
  await expect(page.locator('.hud-lieu')).toHaveText("Maison d'Odile");
  await expect(page.locator('.hud-objectif')).not.toBeEmpty();
  await expect(page.locator('.croix')).toBeVisible();
  expect(erreurs).toEqual([]);
});

test('déplacement au clavier et à la croix tactile', async ({ page }) => {
  await nouvellePartie(page);
  const avant = await etat(page);
  await page.keyboard.down('ArrowLeft');
  await page.waitForTimeout(500);
  await page.keyboard.up('ArrowLeft');
  await page.waitForTimeout(250);
  const apres = await etat(page);
  expect(apres.x).toBeLessThan(avant.x);
  // Croix tactile : appui maintenu sur la moitié basse.
  const croix = await page.locator('.croix').boundingBox();
  if (!croix) throw new Error('croix absente');
  await page.mouse.move(croix.x + croix.width / 2, croix.y + croix.height * 0.9);
  await page.mouse.down();
  await page.waitForTimeout(450);
  await page.mouse.up();
  await page.waitForTimeout(250);
  expect((await etat(page)).y).toBeGreaterThan(apres.y);
});

test('menu, sauvegarde dans un carnet, rechargement et reprise', async ({ page }) => {
  await nouvellePartie(page);
  await page.locator('.hud-menu').click();
  await expect(page.locator('.menu')).toBeVisible();
  await expect(page.locator('.carte-heros')).toHaveCount(1);
  for (const o of ['Objets', 'Quêtes', 'Options']) await page.locator('.onglet', { hasText: o }).click();
  await page.locator('.onglet', { hasText: 'Sauver' }).click();
  await page.locator('.ligne-objet', { hasText: 'Carnet 1' }).click();
  await expect(page.locator('.ligne-objet', { hasText: 'Carnet 1' })).toContainText('Acte 1');
  const avant = await etat(page);
  await page.reload();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect.poll(async () => (await etat(page)).carte).toBe(avant.carte);
  const apres = await etat(page);
  expect([apres.x, apres.y]).toEqual([avant.x, avant.y]);
});

test('boutique : acheter puis quitter', async ({ page }) => {
  await nouvellePartie(page);
  await page.evaluate(() => window.__kevlegende!.evenement('tilda'));
  await page.locator('.dialogue-boite').click();
  await page.locator('.dialogue-boite').click();
  await expect(page.locator('.boutique')).toBeVisible();
  const or = await page.evaluate(() => window.__kevlegende!.app.j!.p.or);
  await page.locator('.boutique .ligne-objet', { hasText: 'Herbe-Douce' }).click();
  expect(await page.evaluate(() => window.__kevlegende!.app.j!.p.or)).toBeLessThan(or);
  await page.getByRole('button', { name: 'Quitter' }).click();
  await expect(page.locator('.boutique')).toBeHidden();
  await expect.poll(async () => (await etat(page)).mode).toBe('exploration');
});

test('combat joué au doigt jusqu’à la victoire', async ({ page }) => {
  const erreurs = await surveillerErreurs(page);
  await nouvellePartie(page);
  await page.evaluate(() => window.__kevlegende!.app.j!.demarrerCombat(['gelee_rosee'], { fuite: true, defaiteOk: false }));
  await expect(page.locator('.combat')).toBeVisible();
  for (let i = 0; i < 40; i++) {
    if (await page.locator('.res-carte').isVisible()) break;
    const attaque = page.getByRole('button', { name: 'Attaquer' });
    if (await attaque.isVisible()) await attaque.click();
    await page.waitForTimeout(250);
  }
  await expect(page.locator('.res-carte h2')).toHaveText('Victoire !');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.locator('.combat')).toBeHidden();
  await finirDialogues(page);
  expect((await etat(page)).mode).toBe('exploration');
  expect(erreurs).toEqual([]);
});

test('aventure complète (Actes I et II) puis sauvegarde de la fin', async ({ page }) => {
  test.setTimeout(400_000);
  const erreurs = await surveillerErreurs(page);
  await nouvellePartie(page);
  const r = await page.evaluate(() => window.__kevlegende!.bot());
  expect(r.combats).toBeGreaterThan(40);
  const s = await etat(page);
  expect(s.flags).toContain('kraken_vaincu');
  expect(s.flags).toContain('acte2_fini');
  expect(s.niveau).toBeGreaterThanOrEqual(15);
  // L'interface reprend la main sur l'état final : quelques images, puis sauvegarde.
  await page.waitForTimeout(600);
  await page.locator('.hud-menu').click();
  await page.locator('.onglet', { hasText: 'Sauver' }).click();
  await page.locator('.ligne-objet', { hasText: 'Carnet 2' }).click();
  await expect(page.locator('.ligne-objet', { hasText: 'Carnet 2' })).toContainText('Acte 2');
  expect(erreurs).toEqual([]);
});
