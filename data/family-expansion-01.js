import {q} from './family-adaptation-model.js';

export const familyExpansion01 = [
  {
    source:'L108', suffix:'A', level:'2-primary', difficulty:'initial',
    summary:['Roc busca su gato dibujado dentro de una caja.', 'En Roc busca el seu gat dibuixat dins d’una capsa.'],
    paragraphs:[
      ['En la sala hay una caja con dibujos. Roc busca su dibujo. Es un gato naranja.', 'A la sala hi ha una capsa amb dibuixos. En Roc busca el seu dibuix. És un gat taronja.'],
      ['Lina pone los dibujos sobre la mesa. El dibujo del gato no lleva el nombre de Roc.', 'La Lina posa els dibuixos damunt la taula. Al dibuix del gat no hi ha el nom d’en Roc.'],
      ['Roc encuentra su gato. Tiene la cola verde. Roc escribe su nombre detrás del papel.', 'En Roc troba el seu gat. Té la cua verda. En Roc escriu el seu nom darrere del paper.'],
      ['Después guarda el dibujo en su carpeta.', 'Després desa el dibuix a la carpeta.'],
    ], imageAfter:[2],
    questions:[
      q('literal',1,'¿De qué color es el gato de Roc?','De quin color és el gat d’en Roc?','Naranja.','Taronja.',[1,'un gato naranja','un gat taronja']),
      q('literal',1,'¿Dónde pone Lina los dibujos?','On posa els dibuixos la Lina?','Sobre la mesa.','Damunt la taula.',[2,'sobre la mesa','damunt la taula']),
      q('literal',1,'¿De qué color es la cola del gato?','De quin color és la cua del gat?','Verde.','Verda.',[3,'la cola verde','la cua verda']),
      q('literal',1,'¿Qué escribe Roc detrás del papel?','Què escriu en Roc darrere del paper?','Su nombre.','El seu nom.',[3,'escribe su nombre','escriu el seu nom']),
    ],
  },
  {
    source:'L108', suffix:'B', level:'4-primary', difficulty:'initial',
    summary:['Una búsqueda entre dibujos lleva a Roc y Lina a cambiar dónde escriben sus nombres.', 'Una cerca entre dibuixos porta en Roc i la Lina a canviar on escriuen els noms.'],
    paragraphs:[
      ['En la sala de lectura guardaban los dibujos en una caja. A media mañana, Roc quiso llevarse a casa su gato naranja. Apartó dos gatos negros y un tigre. Después volvió a mirar desde el principio, por si había pasado una hoja demasiado deprisa. Su gato seguía sin aparecer.', 'A la sala de lectura desaven els dibuixos en una capsa. A mig matí, en Roc es va voler endur a casa el seu gat taronja. Va apartar dos gats negres i un tigre. Després va tornar a mirar des del principi, per si havia passat un full massa de pressa. El seu gat encara no apareixia.'],
      ['Lina extendió los papeles sobre una mesa. En algunos, el nombre estaba bajo el dibujo; en otros, detrás. Separaron las hojas sin nombre. Entre ellas apareció un gato naranja con la cola verde. Roc recordaba cómo había manchado de verde el pincel antes de pintar aquella cola. Era el suyo.', 'La Lina va estendre els papers damunt una taula. En alguns, el nom era sota el dibuix; en d’altres, al darrere. Van separar els fulls sense nom. Entre aquests va aparèixer un gat taronja amb la cua verda. En Roc recordava com havia tacat de verd el pinzell abans de pintar aquella cua. Era el seu.'],
      ['Escribió su nombre detrás. Lina propuso reservar siempre la misma esquina para firmar. Quienes estaban allí marcaron sus dibujos y dejaron secar la tinta. Las hojas de quienes habían salido siguieron aparte, esperando a que regresaran y pudieran reconocerlas.', 'Va escriure el seu nom al darrere. La Lina va proposar reservar sempre la mateixa cantonada per signar. Els qui eren allà van marcar els seus dibuixos i van deixar assecar la tinta. Els fulls dels qui havien sortit van continuar a part, esperant que tornessin i els poguessin reconèixer.'],
      ['Por la tarde, una niña buscó un dragón que acababa de dibujar. Roc le preguntó si había escrito el nombre. Ella asintió. Él giró las hojas y miró directamente en la esquina acordada. La niña encontró su dragón sin tener que describir cada una de sus escamas.', 'A la tarda, una nena va buscar un drac que acabava de dibuixar. En Roc li va preguntar si hi havia escrit el nom. Ella va fer que sí. Ell va girar els fulls i va mirar directament a la cantonada acordada. La nena va trobar el seu drac sense haver de descriure cadascuna de les escates.'],
    ], imageAfter:[2],
    questions:[
      q('literal',1,'¿Qué dibujo buscaba Roc y para qué?','Quin dibuix buscava en Roc i per a què?','Su gato naranja, para llevarlo a casa.','El seu gat taronja, per endur-se’l a casa.',[1,'llevarse a casa su gato naranja','endur a casa el seu gat taronja']),
      q('literal',1,'¿En qué grupo apareció el gato?','En quin grup va aparèixer el gat?','Entre las hojas sin nombre.','Entre els fulls sense nom.',[2,'Separaron las hojas sin nombre. Entre ellas apareció','Van separar els fulls sense nom. Entre aquests va aparèixer']),
      q('inference',2,'¿Por qué la cola verde ayuda a Roc a reconocer su dibujo?','Per què la cua verda ajuda en Roc a reconèixer el seu dibuix?','Es un detalle que recuerda haber pintado él mismo.','És un detall que recorda haver pintat ell mateix.',[2,'Roc recordaba cómo había manchado de verde el pincel','En Roc recordava com havia tacat de verd el pinzell']),
      q('literal',1,'¿Dónde acuerdan escribir el nombre?','On acorden escriure el nom?','Detrás, siempre en la misma esquina.','Al darrere, sempre a la mateixa cantonada.',[3,'su nombre detrás. Lina propuso reservar siempre la misma esquina','el seu nom al darrere. La Lina va proposar reservar sempre la mateixa cantonada']),
      q('literal',2,'¿Por qué dejan aparte algunos dibujos aunque ya hayan acordado cómo firmar?','Per què deixen a part alguns dibuixos encara que ja hagin acordat com signar?','Sus autores han salido y aún tienen que reconocerlos antes de ponerles el nombre.','Els autors han sortit i encara els han de reconèixer abans de posar-hi el nom.',[3,'esperando a que regresaran y pudieran reconocerlas','esperant que tornessin i els poguessin reconèixer']),
      q('structure',2,'Explica qué hace Roc de otra manera en la búsqueda de la tarde.','Explica què fa diferent en Roc en la cerca de la tarda.','Pregunta si hay nombre y mira la esquina acordada, en lugar de reconocer el dibujo solo por sus detalles.','Pregunta si hi ha nom i mira la cantonada acordada, en comptes de reconèixer el dibuix només pels detalls.',[2,'un gato naranja con la cola verde','un gat taronja amb la cua verda'],[4,'miró directamente en la esquina acordada','va mirar directament a la cantonada acordada']),
      q('opinion',2,'¿Qué harías con un dibujo sin nombre que nadie reconoce ese día?','Què faries amb un dibuix sense nom que aquell dia ningú no reconeix?','Respuesta abierta compatible con conservarlo y facilitar que su autor lo encuentre; no atribuirlo a alguien sin una pista.','Resposta oberta compatible amb conservar-lo i facilitar que l’autor el trobi; no atribuir-lo a algú sense cap pista.'),
    ],
  },
  {
    source:'L127', suffix:'A', level:'2-primary', difficulty:'initial',
    summary:['Junta los calcetines iguales y guarda los que están solos.', 'Ajunta els mitjons iguals i desa els que estan sols.'],
    paragraphs:[
      ['Vacía la caja de calcetines sobre la mesa. Busca dos calcetines iguales.', 'Buida la capsa de mitjons damunt la taula. Busca dos mitjons iguals.'],
      ['Junta los dos con una pinza. Ya tienes una pareja. Ponla en el cajón.', 'Ajunta tots dos mitjons amb una pinça. Ja tens una parella. Posa-la al calaix.'],
      ['Sigue buscando otras parejas. Usa una pinza para cada pareja.', 'Continua buscant altres parelles. Fes servir una pinça per a cada parella.'],
      ['Deja en la caja los calcetines que están solos. Otro día puedes encontrar sus parejas.', 'Deixa a la capsa els mitjons que estan sols. Un altre dia pots trobar les seves parelles.'],
    ], imageAfter:[2],
    questions:[
      q('literal',1,'¿Dónde vacías la caja?','On buides la capsa?','Sobre la mesa.','Damunt la taula.',[1,'sobre la mesa','damunt la taula']),
      q('literal',1,'¿Qué usas para juntar dos calcetines iguales?','Què fas servir per ajuntar dos mitjons iguals?','Una pinza.','Una pinça.',[2,'con una pinza','amb una pinça']),
      q('literal',1,'¿Dónde pones la pareja?','On poses la parella?','En el cajón.','Al calaix.',[2,'en el cajón','al calaix']),
      q('literal',1,'¿Dónde dejas los calcetines que están solos?','On deixes els mitjons que estan sols?','En la caja.','A la capsa.',[4,'Deja en la caja','Deixa a la capsa']),
    ],
  },
  {
    source:'L127', suffix:'B', level:'4-primary', difficulty:'initial',
    summary:['Ordena los calcetines por parejas sin perder los que todavía están solos.', 'Ordena els mitjons per parelles sense perdre els que encara estan sols.'],
    paragraphs:[
      ['Para ordenar una caja de calcetines, prepara una mesa despejada y unas pinzas de tender. Saca todos los calcetines. Si empiezas buscando solo dentro de la caja, puedes volver a mirar varias veces el mismo sin darte cuenta.', 'Per ordenar una capsa de mitjons, prepara una taula buida i unes pinces d’estendre. Treu tots els mitjons. Si comences buscant només dins la capsa, pots tornar a mirar diverses vegades el mateix sense adonar-te’n.'],
      ['Separa los lisos de los que tienen dibujos. Después compara los de cada grupo: fíjate en el color, el dibujo y el tamaño. Dos calcetines azules pueden ser distintos si uno es pequeño y el otro grande. Coloca los que sean iguales uno junto al otro y sujétalos con una pinza.', 'Separa els llisos dels que tenen dibuixos. Després compara els de cada grup: fixa’t en el color, el dibuix i la mida. Dos mitjons blaus poden ser diferents si un és petit i l’altre gran. Col·loca els que siguin iguals l’un al costat de l’altre i subjecta’ls amb una pinça.'],
      ['Reserva una zona de la mesa para las parejas terminadas. Deja en otra los calcetines que siguen solos. Cada vez que encuentres una pareja, pásala a la zona terminada. Así sabrás cuáles te quedan por revisar.', 'Reserva una zona de la taula per a les parelles acabades. Deixa en una altra els mitjons que continuen sols. Cada vegada que trobis una parella, passa-la a la zona acabada. Així sabràs quins et queden per revisar.'],
      ['Cuando acabes, guarda las parejas dobladas en el cajón o cuélgalas de una cuerda. Los calcetines solos vuelven a la caja. Si al día siguiente aparece otro, compáralo primero con esos. Imagina que hoy has formado cuatro parejas y te han quedado tres calcetines solos: habrás usado cuatro pinzas y guardarás tres calcetines en la caja.', 'Quan acabis, desa les parelles plegades al calaix o penja-les en una corda. Els mitjons sols tornen a la capsa. Si l’endemà n’apareix un altre, compara’l primer amb aquests. Imagina que avui has format quatre parelles i t’han quedat tres mitjons sols: hauràs fet servir quatre pinces i desaràs tres mitjons a la capsa.'],
    ], imageAfter:[2],
    questions:[
      q('literal',1,'¿Qué dos grupos haces al principio?','Quins dos grups fas al principi?','Calcetines lisos y calcetines con dibujos.','Mitjons llisos i mitjons amb dibuixos.',[2,'Separa los lisos de los que tienen dibujos','Separa els llisos dels que tenen dibuixos']),
      q('inference',2,'¿Por qué dos calcetines azules no siempre forman una pareja?','Per què dos mitjons blaus no sempre formen una parella?','Pueden tener tamaños o dibujos diferentes; hay que comparar más que el color.','Poden tenir mides o dibuixos diferents; cal comparar més coses que el color.',[2,'el color, el dibujo y el tamaño','el color, el dibuix i la mida'],[2,'uno es pequeño y el otro grande','un és petit i l’altre gran']),
      q('literal',1,'¿Con qué sujetas cada pareja?','Amb què subjectes cada parella?','Con una pinza.','Amb una pinça.',[2,'sujétalos con una pinza','subjecta’ls amb una pinça']),
      q('literal',2,'¿Para qué sirve separar las parejas terminadas?','Per a què serveix separar les parelles acabades?','Para distinguir lo que ya está ordenado de lo que falta revisar.','Per distingir el que ja està ordenat del que falta revisar.',[3,'Así sabrás cuáles te quedan por revisar','Així sabràs quins et queden per revisar']),
      q('structure',2,'¿Dónde buscarías primero la pareja de un calcetín que aparece mañana? Explica por qué.','On buscaries primer la parella d’un mitjó que apareix demà? Explica per què.','En la caja de los solos, porque allí se han guardado los que todavía no tenían pareja.','A la capsa dels que estan sols, perquè s’hi han desat els que encara no tenien parella.',[4,'Los calcetines solos vuelven a la caja','Els mitjons sols tornen a la capsa'],[4,'compáralo primero con esos','compara’l primer amb aquests']),
      q('literal',2,'En el ejemplo final, ¿cuántas pinzas usas y cuántos calcetines vuelven a la caja?','A l’exemple final, quantes pinces fas servir i quants mitjons tornen a la capsa?','Cuatro pinzas y tres calcetines.','Quatre pinces i tres mitjons.',[4,'cuatro pinzas y guardarás tres calcetines','quatre pinces i desaràs tres mitjons']),
      q('opinion',2,'¿Cómo señalarías las dos zonas de la mesa para que otra persona pudiera ayudarte?','Com indicaries les dues zones de la taula perquè una altra persona et pogués ajudar?','Respuesta abierta con una señal comprensible que distinga parejas terminadas y calcetines pendientes.','Resposta oberta amb un senyal entenedor que distingeixi les parelles acabades dels mitjons pendents.'),
    ],
  },
];
