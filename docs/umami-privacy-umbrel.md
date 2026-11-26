# Privadesa de la instància d’Umami a Umbrel

Revisat el 26 de novembre del 2026. **Pendent d’aplicar al dispositiu**: el propietari no hi pot accedir des de la connexió actual. La publicació de Trama només modifica el web; no canvia Umbrel, el proxy, les sessions existents ni les còpies de seguretat del servidor.

## Objectiu

Conservar estadístiques útils per ampliar el catàleg: preparacions de fitxes públiques per codi, variant, curs, llengua i univers. No interessa identificar docents, construir historials personals o conèixer-ne la localització detallada. El web exclou textos personals, consultes, codis d’aula, logotips, noms de col·leccions i configuracions. No envia identificadors de persones ni de lots.

## Què significa anonimitzar aquí

Segons les [definicions d’Umami](https://docs.umami.is/docs/metric-definitions), la IP es processa per derivar la sessió i, quan cal, localització aproximada, però no es desa com a camp dels registres estàndard d’analítica. El proxy o els registres operatius poden conservar-la separadament. Per tant, no hi ha simplement una columna d’IP que s’hagi de buidar periòdicament.

La rotació dels identificadors limita la vinculació entre períodes; no elimina els registres antics ni els converteix automàticament en estadístiques anònimes. Esborrar sessions sense estudiar l’esquema pot eliminar o afectar les dades d’esdeveniments que s’hi relacionen. Aquesta guia no inclou cap esborrament automàtic.

## Quan es recuperi l’accés

1. Confirmar la versió real instal·lada i el servei que executa Umami. La [fitxa oficial d’Umbrel](https://apps.umbrel.com/app/umami) consultada ofereix 3.4.0, però això no acredita la versió del dispositiu. El [compose oficial](https://github.com/getumbrel/umbrel-apps/blob/master/umami/docker-compose.yml) defineix els serveis app i db; cal contrastar-lo amb la instal·lació local abans d’editar res.
2. En **Umami 3.1 o posterior**, afegir al servei de l’aplicació la variable d’entorn següent i reiniciar només l’aplicació segons el procediment d’Umbrel:

   ```yaml
   SALT_ROTATION: "day"
   ```

   La [documentació oficial](https://docs.umami.is/docs/environment-variables#salt_rotation) indica rotació diària a les 00:00 UTC. Això conserva els recomptes i impedeix que el mateix identificador generat s’allargui entre dies; no garanteix anonimat absolut. No canviar APP_SECRET amb aquesta finalitat: també intervé en l’autenticació. Les personalitzacions del paquet poden perdre’s amb una actualització d’Umbrel i s’han de revisar després. No aplicar opcions exclusives d’una versió més nova sense confirmar-ne la compatibilitat.
3. Revisar la localització i els logs del recorregut real de les peticions (Umami, exposició pública i proxy). L’opció SKIP_LOCATION_HEADERS només canvia la font de geolocalització, no la desactiva. No hi ha cap canvi al JavaScript de Trama que pugui ocultar la IP de la connexió al receptor. Evitar logs d’IP innecessaris i limitar-ne la conservació requereix configurar els serveis corresponents.
4. Fixar una política de conservació. Proposta de treball: conservar detall durant **13 mesos** per comparar l’estacionalitat escolar; mantenir més temps només recomptes realment agregats si cal. A les instal·lacions pròpies, [Umami conserva les dades indefinidament si no es gestionen](https://docs.umami.is/docs/faq). La rotació diària no aplica una retenció. Confirmar versió, esquema, exportació d’agregats i còpies abans de preparar una eliminació, perquè no es perdin les estadístiques que sí interessen. Incloure les còpies de seguretat en aquesta política.

La configuració mínima proposada és rotació diària, cap identificador propi ni seguiment entre projectes, consulta de recomptes per material i revisió de localització/logs/retenció al servidor. El codi de Trama no utilitza umami.identify, gravacions de sessió ni mapes de calor. Les dades noves del rànquing es documenten a [analytics.md](analytics.md).
