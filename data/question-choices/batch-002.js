// L006–L010, including the existing A/B editions. Open production tasks stay open.
export const choiceBatch002 = [
  {code:'L006',language:'es',questions:{
    'ballena-q2':{
      prompt:'¿Qué son las «muescas» que comparan en las fotos?',
      options:['Zonas claras del dibujo que aparece bajo la cola.','Pliegues que se forman al levantar la cola para sumergirse.','Pequeños entrantes que se observan en el borde de la aleta.','Partes oscuras de la cola producidas por la luz de la foto.'],
      correct:'c',explanation:'Las muescas son entrantes del contorno de la aleta; se comparan junto con las manchas, que son otro rasgo.'
    },
    'ballena-q3':{
      prompt:'¿Qué dos marcas coinciden y dónde está la muesca?',
      options:['Una media luna blanca y una muesca en el borde derecho.','Una media luna blanca y una muesca en el borde izquierdo.','Una media luna oscura y una muesca en el borde derecho.','Dos manchas blancas y una muesca en el centro de la cola.'],
      correct:'a',explanation:'En ambas fotos coinciden una mancha blanca de media luna y una muesca situada en el borde derecho.'
    },
    'ballena-q4':{
      prompt:'¿Por qué es más fiable comparar las marcas que la claridad de las fotos?',
      options:['Porque la foto más clara muestra siempre las marcas más recientes.','Porque las marcas solo se pueden comparar si la cola está en la misma postura.','Porque compartir código basta para comprobar cualquier diferencia de luz.','Porque la luz cambia el aspecto, mientras las marcas coinciden en lugar y forma.'],
      correct:'d',explanation:'La iluminación explica la diferencia de claridad; la forma y la posición de las marcas permiten reconocer la misma cola.'
    },
    'ballena-q5':{
      prompt:'¿Qué indica dibujar a trazos la línea entre los dos puntos?',
      options:['Que la ballena recorrió varios caminos distintos entre los puntos.','Que se conocen dos lugares donde estuvo, pero no la ruta exacta.','Que las dos fotos permiten conocer la ruta, pero no identificar al animal.','Que aún se duda del lugar de las fotos, aunque se conoce el recorrido.'],
      correct:'b',explanation:'Las fotos sitúan dos encuentros de la misma ballena. Los trazos dejan abierta la ruta intermedia, que no fue observada.'
    }
  }},
  {code:'L006',language:'ca',questions:{
    'ballena-q2':{
      prompt:'Què són les «osques» que comparen a les fotos?',
      options:['Les zones blanques de les taques que té sota la cua.','Els plecs que es formen quan la balena aixeca la cua.','Les parts fosques de l’aleta que depenen de la llum.','Els petits entrants que hi ha al contorn de l’aleta.'],
      correct:'d',explanation:'Les osques són entrants de la vora de l’aleta; les taques sota la cua són un altre tret que també comparen.'
    },
    'ballena-q3':{
      prompt:'Quines marques coincideixen i on és l’osca?',
      options:['Una mitja lluna fosca i una osca a la vora dreta.','Una mitja lluna blanca i una osca a la vora esquerra.','Dues taques blanques i una osca al centre de la cua.','Una mitja lluna blanca i una osca a la vora dreta.'],
      correct:'d',explanation:'A totes dues imatges hi ha la taca blanca de mitja lluna i l’osca a la vora dreta de la cua.'
    },
    'ballena-q4':{
      prompt:'Per què és més fiable comparar les marques que la claror de les fotos?',
      options:['Perquè la imatge clara mostra sempre les marques més recents.','Perquè la llum en canvia l’aspecte, però les marques conserven forma i lloc.','Perquè les marques només es poden comparar si la cua manté la mateixa postura.','Perquè el mateix codi confirma qualsevol diferència entre dues imatges.'],
      correct:'b',explanation:'La llum pot fer semblar diferent una mateixa cua. Les marques que coincideixen en forma i posició ajuden a identificar-la.'
    },
    'ballena-q5':{
      prompt:'Què indica la línia a traços entre els punts del mapa?',
      options:['Que es coneixen dos indrets on va ser, però no el camí exacte.','Que es coneix el camí que va fer, però no quina balena era.','Que la balena va seguir diverses rutes entre els dos indrets.','Que es dubta dels llocs de les fotos, però es coneix el recorregut.'],
      correct:'a',explanation:'Les fotos documenten dos llocs on van veure la balena. Els traços assenyalen que el recorregut entre tots dos encara es desconeix.'
    }
  }},
  {code:'L006A',language:'es',questions:{
    'l006a-q2':{
      prompt:'¿Qué pareja de marcas aparece en las dos fotos?',
      options:['Una mancha blanca redonda y una muesca en el borde derecho.','Una mancha blanca de media luna y una muesca en el borde derecho.','Una mancha blanca de media luna y una muesca en el borde izquierdo.','Una mancha oscura redonda y una muesca en el borde izquierdo.'],
      correct:'b',explanation:'Coinciden la mancha blanca con forma de media luna y la muesca del borde derecho.'
    },
    'l006a-q3':{
      prompt:'¿Qué son las «muescas» del borde de la cola?',
      options:['Las partes blancas del dibujo que hay debajo de la cola.','Las sombras que aparecen en una foto más oscura.','Las arrugas que se forman al torcer la cola.','Los pequeños entrantes o hendiduras del contorno.'],
      correct:'d',explanation:'Una muesca es un entrante del borde, no una mancha ni una diferencia de iluminación.'
    },
    'l006a-q4':{
      prompt:'¿Por qué la foto oscura no basta para decir que es otra ballena?',
      options:['Porque se tomó junto a la misma isla que la foto clara.','Porque la luz cambia el aspecto y las marcas siguen coincidiendo.','Porque las fotos se hicieron con pocos minutos de diferencia.','Porque una cola torcida deja de mostrar sus marcas.'],
      correct:'b',explanation:'La luz puede oscurecer la imagen sin cambiar la identidad del animal; las dos marcas siguen coincidiendo.'
    },
    'l006a-q5':{
      prompt:'¿Por qué Alba cambia la línea del mapa por una línea a trazos?',
      options:['Conocen los lugares de los encuentros, pero no el camino entre ellos.','Conocen el camino entre los puntos, pero no las fechas de las fotos.','Saben que las fotos son de dos ballenas que siguieron la misma ruta.','Saben que la ballena estuvo en la isla, pero no en la costa lejana.'],
      correct:'a',explanation:'Los puntos corresponden a lugares donde la vieron. La línea a trazos evita presentar como conocido el recorrido intermedio.',
      evidence:[{paragraph:4,text:'sabían que había estado en esos lugares, pero no qué camino había seguido entre ellos.'}]
    }
  }},
  {code:'L006A',language:'ca',questions:{
    'l006a-q2':{
      prompt:'Quina parella de marques es veu a totes dues fotos?',
      options:['Una taca blanca rodona i una osca a la vora dreta.','Una taca blanca de mitja lluna i una osca a la vora esquerra.','Una taca blanca de mitja lluna i una osca a la vora dreta.','Una taca fosca rodona i una osca a la vora esquerra.'],
      correct:'c',explanation:'La taca blanca té forma de mitja lluna i l’osca es troba a la vora dreta.'
    },
    'l006a-q3':{
      prompt:'Què són les «osques» de la vora de la cua?',
      options:['Petits entrants o talls al contorn de l’aleta.','Taques clares del dibuix que hi ha sota la cua.','Plecs que apareixen quan la cua està de gairell.','Ombres que es veuen a la foto que és més fosca.'],
      correct:'a',explanation:'Les osques són entrants del contorn. No són taques de color ni ombres produïdes per la llum.'
    },
    'l006a-q4':{
      prompt:'Per què la foto fosca no demostra que sigui una altra balena?',
      options:['Perquè les dues fotos es van fer a prop de la mateixa illa.','Perquè entre les dues fotos havien passat només uns minuts.','Perquè una cua de gairell ja no permet veure les marques.','Perquè la llum en canvia l’aspecte i les marques continuen coincidint.'],
      correct:'d',explanation:'La il·luminació pot fer una foto més fosca, però les marques continuen sent les mateixes i ajuden a reconèixer la balena.'
    },
    'l006a-q5':{
      prompt:'Per què l’Alba acaba fent la línia a traços?',
      options:['Coneixen la ruta entre els punts, però no les dates de les fotos.','Coneixen els llocs de les observacions, però no la ruta entre tots dos.','Saben que hi ha dues balenes que van seguir un mateix camí.','Saben que va ser a l’illa, però no si va arribar a la costa llunyana.'],
      correct:'b',explanation:'Han situat dos llocs on la van veure. Els traços indiquen que no saben quin camí va seguir entre aquells llocs.',
      evidence:[{paragraph:4,text:'sabien que havia estat en aquells llocs, però no quin camí havia seguit entre tots dos.'}]
    }
  }},
  {code:'L006B',language:'es',questions:{
    'l006b-q1':{
      prompt:'¿Qué coincidencia permite comparar las dos colas?',
      options:['Una media luna blanca y una muesca en el borde izquierdo.','Una media luna oscura y una muesca en el borde derecho.','Una media luna blanca y dos muescas en el centro del borde.','Una media luna blanca y una muesca en el borde derecho.'],
      correct:'d',explanation:'Se reconocen la misma mancha blanca de media luna y la muesca del borde derecho, aunque la cola aparezca torcida.'
    },
    'l006b-q3':{
      prompt:'¿Qué significa que las marcas conservan su «posición relativa»?',
      options:['Que las dos fotos sitúan a la ballena en el mismo lugar del mapa.','Que una marca mantiene su lugar respecto a la otra al girarse la cola.','Que las marcas mantienen su distancia al borde de la fotografía.','Que ambas fotos muestran la cola en el mismo ángulo respecto al agua.'],
      correct:'b',explanation:'Se refiere a la relación entre las dos marcas de la cola, no a su posición en el mapa o dentro de la fotografía.'
    },
    'l006b-q4':{
      prompt:'Una foto permite reconocer la cola, pero carece de fecha. ¿Qué se puede concluir?',
      options:['Permite identificar al animal y ordenar ese encuentro entre los otros dos.','Permite fechar el encuentro, pero la identidad requiere saber el lugar.','Permite reconocer al individuo, pero no fechar por sí sola ese encuentro.','Solo confirma las marcas; reconocer al individuo exige conocer la fecha.'],
      correct:'c',explanation:'Las marcas pueden identificar a la ballena. Sin fecha, no se sabe cuándo se produjo ese encuentro.'
    },
    'l006b-q6':{
      prompt:'¿Qué afirmación no demostrada podía sugerir la línea continua entre los puntos?',
      options:['Se había comprobado el camino seguido entre ambos encuentros.','Las dos fotografías se habían archivado como un mismo individuo.','La ballena había sido observada en dos lugares alejados entre sí.','Los encuentros se habían producido con varios meses de diferencia.'],
      correct:'a',explanation:'Las fotos documentan dos posiciones y sus fechas, pero no el itinerario entre ellas. Una línea continua podría presentar ese itinerario como comprobado.'
    },
    'l006b-q7':{
      prompt:'¿Qué permite afirmar una zona del mapa sin fotografías de esta ballena?',
      options:['Que no pasó por allí, aunque desconocemos la ruta que sí siguió.','Que pasó por allí, porque está entre los dos puntos del registro.','Que pudo pasar por allí sin que ese paso haya quedado registrado.','Que las fotos de sus marcas no sirven para reconocer al individuo.'],
      correct:'c',explanation:'La falta de fotografías no prueba la ausencia de la ballena. Su paso por esa zona es posible, pero no está confirmado.'
    }
  }},
  {code:'L006B',language:'ca',questions:{
    'l006b-q1':{
      prompt:'Quines marques coincideixen a les dues cues?',
      options:['Una mitja lluna blanca i una osca a la vora esquerra.','Una mitja lluna blanca i una osca a la vora dreta.','Una mitja lluna fosca i una osca a la vora dreta.','Una mitja lluna blanca i dues osques al centre de la vora.'],
      correct:'b',explanation:'Coincideixen la taca blanca de mitja lluna i l’osca de la vora dreta, malgrat la cua una mica girada.'
    },
    'l006b-q3':{
      prompt:'Què vol dir que les marques conserven la «posició relativa»?',
      options:['Que totes dues fotos situen la balena al mateix lloc del mapa.','Que les marques són a la mateixa distància de la vora de la foto.','Que totes dues fotos mostren la cua amb el mateix angle sobre l’aigua.','Que una marca manté el lloc respecte de l’altra encara que giri la cua.'],
      correct:'d',explanation:'Es conserva la relació de lloc entre les marques. La cua pot estar girada i la foto pot haver-se fet en un altre indret.'
    },
    'l006b-q4':{
      prompt:'Una foto permet reconèixer la cua, però no té data. Què se’n pot concloure?',
      options:['Permet reconèixer l’individu, però tota sola no permet datar l’observació.','Permet situar l’observació entre les altres dues, a més d’identificar l’animal.','Permet datar l’observació, però falta saber-ne el lloc per identificar l’animal.','Només confirma les marques, perquè per identificar l’animal cal conèixer la data.'],
      correct:'a',explanation:'Les marques poden identificar la balena, però la manca de data impedeix saber quan es va produir aquella observació.'
    },
    'l006b-q6':{
      prompt:'Quina afirmació no demostrada podia suggerir la línia contínua entre els punts?',
      options:['Les dues fotos s’havien arxivat amb el mateix codi d’individu.','Les dues observacions s’havien fet amb mesos de diferència.','S’havia comprovat el camí recorregut entre totes dues observacions.','La balena havia estat observada en dos indrets allunyats entre si.'],
      correct:'c',explanation:'Coneixen els llocs i les dates de dues observacions, però no l’itinerari intermedi. La línia contínua podia fer-lo semblar comprovat.'
    },
    'l006b-q7':{
      prompt:'Què permet afirmar una zona del mapa sense fotos d’aquesta balena?',
      options:['No hi va passar, encara que no sabem per on va viatjar.','Hi podria haver passat sense que se’n conservi cap fotografia.','Hi va passar perquè és entre els dos punts on la van veure.','Les marques de les fotos no serveixen per reconèixer aquella balena.'],
      correct:'b',explanation:'Una manca de fotografies no demostra que la balena no hi fos. És possible que hi passés, però no està documentat.'
    }
  }},
  {code:'L007',language:'es',questions:{
    'rayas-q1':{
      prompt:'¿Cuántas bolsitas representa un grupo completo, incluida la raya inclinada?',
      options:['Cuatro bolsitas.','Cinco bolsitas.','Seis bolsitas.','Nueve bolsitas.'],
      correct:'b',explanation:'Las cuatro rayas verticales y la inclinada representan una bolsita cada una: cinco en total.'
    },
    'rayas-q2':{
      prompt:'¿Qué hacían justo después de la raya inclinada que cerraba el grupo?',
      options:['Dejaban un hueco y empezaban otro grupo de rayas.','Añadían otra raya vertical antes de dejar el hueco.','Escribían el total con cifras antes de atender otra bolsita.','Anotaban quién la había traído al lado del grupo.'],
      correct:'a',explanation:'Después de completar cinco marcas dejaban un espacio y comenzaban un grupo nuevo. Las cifras se añadieron al cerrar la feria.'
    },
    'rayas-q3':{
      prompt:'¿Qué cálculo corresponde a las bolsitas de lentejas de media mañana?',
      options:['Diez: se cuentan los dos grupos completos y se omiten las sueltas.','Catorce: se cuentan seis por grupo y se añaden las dos sueltas.','Diecisiete: se cuentan tres grupos de cinco y dos rayas sueltas.','Doce: se cuentan dos grupos de cinco y se añaden dos rayas sueltas.'],
      correct:'d',explanation:'Las lentejas tienen dos grupos completos y dos rayas: 5 + 5 + 2 = 12. Los tres grupos y dos rayas corresponden a las judías.'
    },
    'rayas-q4':{
      prompt:'¿En qué párrafos se explica la regla y se aplica después a las judías?',
      options:['Regla en el primero; judías en el segundo.','Regla en el segundo; judías en el tercero.','Regla en el tercero; judías en el cuarto.','Regla en el segundo; judías en el quinto.'],
      correct:'b',explanation:'El segundo párrafo explica cómo cerrar cada grupo de cinco. El tercero aplica la regla para obtener diecisiete bolsitas de judías.'
    }
  }},
  {code:'L007',language:'ca',questions:{
    'rayas-q1':{
      prompt:'Quantes bossetes representa un grup complet, amb la ratlla inclinada inclosa?',
      options:['Sis bossetes.','Quatre bossetes.','Cinc bossetes.','Nou bossetes.'],
      correct:'c',explanation:'Cadascuna de les quatre ratlles verticals i la inclinada compta una bosseta. El grup en representa cinc.'
    },
    'rayas-q2':{
      prompt:'Què feien just després de la ratlla inclinada que tancava un grup?',
      options:['Afegien una ratlla vertical abans de deixar un espai.','Escrivien el total amb xifres abans d’atendre una altra bosseta.','Anotaven el nom de qui l’havia portada al costat del grup.','Deixaven un espai i començaven un altre grup de ratlles.'],
      correct:'d',explanation:'Un cop tancat el grup de cinc, deixaven un espai i en començaven un altre. Les xifres les van posar al final de la fira.'
    },
    'rayas-q3':{
      prompt:'Quin càlcul correspon a les bossetes de llenties de mig matí?',
      options:['Disset: tres grups de cinc més dues ratlles soltes.','Dotze: dos grups de cinc més dues ratlles soltes.','Deu: dos grups complets sense sumar les ratlles soltes.','Catorze: sis marques per grup més dues ratlles soltes.'],
      correct:'b',explanation:'A les llenties hi ha dos grups de cinc i dues ratlles: 5 + 5 + 2 = 12. Disset és el recompte de les mongetes.'
    },
    'rayas-q4':{
      prompt:'A quins paràgrafs s’explica la regla i després s’aplica a les mongetes?',
      options:['Regla al segon; mongetes al tercer.','Regla al primer; mongetes al segon.','Regla al tercer; mongetes al quart.','Regla al segon; mongetes al cinquè.'],
      correct:'a',explanation:'El segon paràgraf presenta els grups de cinc i el tercer mostra com la Irene arriba a disset amb les mongetes.'
    }
  }},
  {code:'L008',language:'es',questions:{
    'pinzas-q2':{
      prompt:'¿Qué observaron con la tela al retirar la pinza y después de la ráfaga?',
      options:['Dejó una marca clara y mantuvo el papel colgado después de la ráfaga.','Evitó una marca clara y mantuvo el papel colgado sin deslizarse después de la ráfaga.','Evitó una marca clara, pero el papel se deslizó después de la ráfaga.','Dejó una marca clara, pero el papel dejó de deslizarse con la ráfaga.'],
      correct:'c',explanation:'La tela protegía el borde en la primera comparación, pero no impidió que el papel se deslizara cuando se movió la cuerda.'
    },
    'pinzas-q3':{
      prompt:'¿Por qué la pinza de goma sigue siendo un «prototipo» tras la prueba?',
      options:['Es un modelo de prueba que aún quieren ensayar con papeles más gruesos.','Es un modelo definitivo que ya han probado con todos los dibujos.','Es el modelo de tela que descartaron cuando se deslizó el papel.','Es una pinza destinada solo a papeles gruesos que aún no han probado con recortes.'],
      correct:'a',explanation:'El prototipo permite probar una solución y seguir evaluándola. El ensayo con el papel usado fue favorable, pero falta comprobar papeles más gruesos.'
    },
    'pinzas-q4':{
      prompt:'¿Qué dificultad querían evitar y qué hicieron para evitarla?',
      options:['No saber qué cambio ayudaba; conservaron la tela y cambiaron solo el muelle.','No saber si influía el papel; probaron dos grosores con el mismo forro.','No poder comparar las marcas; añadieron otra capa de tela a la pinza.','No saber qué cambio ayudaba; conservaron la pinza y cambiaron solo el forro.'],
      correct:'d',explanation:'Cambiar muelle y tela a la vez impediría atribuir la mejora a uno de ellos. Mantuvieron la pinza y sustituyeron la tela por goma.'
    },
    'pinzas-q8':{
      prompt:'Un papel grueso no se desliza, pero queda marcado. ¿Qué objetivo se ha logrado?',
      options:['Proteger el borde, aunque todavía no sujetan bien el papel.','Sujetar el papel, aunque todavía no evitan marcar el borde.','Cumplir ambos objetivos, aunque falte probar el papel fino.','Ninguno de los dos, porque el papel probado es más grueso.'],
      correct:'b',explanation:'Que no se deslice demuestra sujeción en esa prueba. La marca muestra que sigue pendiente proteger el papel.'
    }
  }},
  {code:'L008',language:'ca',questions:{
    'pinzas-q2':{
      prompt:'Què observen amb la roba quan treuen la pinça i després de la ràfega?',
      options:['No deixa una marca ben visible, però el paper rellisca després de la ràfega.','No deixa una marca ben visible i el paper continua penjat sense relliscar després de la ràfega.','Deixa una marca ben visible i el paper continua penjat després de la ràfega.','Deixa una marca ben visible, però la ràfega fa que ja no rellisqui el paper.'],
      correct:'a',explanation:'La roba protegia la vora quan van retirar la pinça, però no va impedir el lliscament quan la ràfega va moure la corda.'
    },
    'pinzas-q3':{
      prompt:'Per què la pinça amb goma continua sent un «prototip» després de la prova?',
      options:['És el model definitiu que ja han provat amb tots els dibuixos.','És el model de roba que van descartar quan el paper va relliscar.','És un model de prova que encara volen assajar amb papers més gruixuts.','És una pinça per a papers gruixuts que encara no han provat amb retalls.'],
      correct:'c',explanation:'El prototip és un model que serveix per provar una solució. Ha funcionat en les condicions de l’assaig, però falta provar-lo amb altres gruixos.'
    },
    'pinzas-q4':{
      prompt:'Quina dificultat volien evitar i què van fer per evitar-la?',
      options:['No saber quin canvi ajudava; van conservar la roba i canviar només la molla.','No saber quin canvi ajudava; van conservar la pinça i canviar només el folre.','No saber si influïa el paper; van provar dos gruixos amb el mateix folre.','No poder comparar les marques; van afegir una altra capa de roba a la pinça.'],
      correct:'b',explanation:'Amb dos canvis simultanis no sabrien quin havia ajudat. Van mantenir la pinça i substituir només la roba per goma.'
    },
    'pinzas-q8':{
      prompt:'Un paper gruixut no rellisca, però queda marcat. Quina part de l’objectiu han assolit?',
      options:['Protegir la vora, però encara no subjectar bé el paper.','Complir tots dos objectius, però falta provar el paper prim.','Cap dels dos, perquè han fet la prova amb un paper gruixut.','Subjectar el paper, però encara no evitar la marca a la vora.'],
      correct:'d',explanation:'Han aconseguit la subjecció en aquell paper, però la marca indica que encara no el protegeixen prou.'
    }
  }},
  {code:'L008A',language:'es',questions:{
    'l008a-q1':{
      prompt:'¿Qué problema tenían las pinzas de madera antes de añadirles tela?',
      options:['Sujetaban las hojas, pero dejaban marcas en el papel.','No sujetaban las hojas, aunque protegían el borde del papel.','No permitían comparar recortes hechos con el mismo papel.','Sujetaban el papel fino, pero solo marcaban el más grueso.'],
      correct:'a',explanation:'Las pinzas iniciales agarraban las hojas, pero las marcaban. La tela fue el primer intento de evitar esas marcas.'
    },
    'l008a-q3':{
      prompt:'¿Había resuelto la pinza con tela tanto la marca como la sujeción?',
      options:['Sí: evitaba la marca y aguantaba la ráfaga del patio.','No: sujetaba con la ráfaga, pero dejaba marcada la hoja.','No: evitaba la marca, pero el papel se deslizó con la ráfaga.','Sí: resolvía ambos problemas, aunque solo en el papel grueso.'],
      correct:'c',explanation:'La tela evitó la marca, pero la ráfaga mostró un problema de sujeción. Había resuelto solo una parte.'
    },
    'l008a-q4':{
      prompt:'¿Qué significa «prototipo» en esta prueba?',
      options:['Un modelo que ya se puede usar con todos los dibujos.','Un modelo para hacer pruebas antes de usarlo de forma general.','Una pinza sin modificar que sirve para comparar las otras.','Un dibujo que sustituye a la prueba con papel verdadero.'],
      correct:'b',explanation:'Es un modelo de prueba: aún querían comprobar su comportamiento con papel más grueso antes de usarlo en toda la exposición.'
    },
    'l008a-q5':{
      prompt:'¿Para qué conservó Vera la pinza al sustituir la tela por goma?',
      options:['Para que la goma se probara con un papel más grueso que la tela.','Para reproducir exactamente la ráfaga que había movido la cuerda.','Para mantener la tela y la goma juntas durante la misma prueba.','Para cambiar una sola cosa y saber si la goma mejoraba el resultado.'],
      correct:'d',explanation:'Mantener la pinza permite variar solo el material de las puntas y relacionar la mejora con ese cambio.'
    }
  }},
  {code:'L008A',language:'ca',questions:{
    'l008a-q1':{
      prompt:'Quin problema tenien les pinces de fusta abans d’afegir-hi roba?',
      options:['No subjectaven els fulls, tot i que protegien la vora del paper.','Subjectaven els fulls, però hi deixaven marques al paper.','No permetien comparar retalls fets amb el mateix paper.','Subjectaven el paper prim, però només marcaven el més gruixut.'],
      correct:'b',explanation:'Les pinces de fusta aguantaven els fulls, però hi deixaven marques. La roba va ser el primer intent de resoldre-ho.'
    },
    'l008a-q3':{
      prompt:'La pinça amb roba havia resolt tant la marca com la subjecció?',
      options:['No: evitava la marca, però el paper va lliscar amb la ràfega.','Sí: evitava la marca i resistia la ràfega del pati.','No: subjectava amb la ràfega, però deixava marcat el full.','Sí: resolia tots dos problemes, encara que només en el paper gruixut.'],
      correct:'a',explanation:'La roba protegia el paper de la marca, però no va impedir que llisqués amb la ràfega: només havia resolt una part.'
    },
    'l008a-q4':{
      prompt:'Què vol dir «prototip» en aquesta prova?',
      options:['Un model que ja es pot fer servir amb tots els dibuixos.','Una pinça sense modificar que serveix per comparar les altres.','Un dibuix que substitueix la prova amb un paper de debò.','Un model per fer proves abans de fer-lo servir de manera general.'],
      correct:'d',explanation:'És un model per assajar la solució. Encara el volien provar amb un paper més gruixut abans d’utilitzar-lo a tota l’exposició.'
    },
    'l008a-q5':{
      prompt:'Per què la Vera conserva la pinça quan substitueix la roba per goma?',
      options:['Per provar la goma amb un paper més gruixut que el de la roba.','Per reproduir exactament la ràfega que havia mogut la corda.','Per canviar una sola cosa i saber si la goma millorava el resultat.','Per mantenir la roba i la goma juntes durant la mateixa prova.'],
      correct:'c',explanation:'Si només canvia el material de les puntes, pot relacionar la millora amb la goma i no amb una pinça diferent.'
    }
  }},
  {code:'L008B',language:'es',questions:{
    'l008b-q2':{
      prompt:'¿Qué limitación mostró la ráfaga en el buen resultado de la tela?',
      options:['Con la tela se evitó el deslizamiento, pero siguieron apareciendo marcas.','Con la tela hubo deslizamiento, pero solo al retirar la pinza del recorte.','La tela evitó el deslizamiento después de añadirle una segunda capa.','La tela protegía el borde, pero no impidió que el recorte se deslizara.'],
      correct:'d',explanation:'El primer resultado se refería a la protección del borde. La ráfaga mostró que el recorte podía deslizarse con ese forro.'
    },
    'l008b-q3':{
      prompt:'Si el resultado mejora al cambiar a la vez muelle y tela, ¿qué podrían concluir sobre la causa?',
      options:['No podrían atribuirla al muelle, al forro o a la combinación de ambos.','La mejora vendría del forro, porque al cambiarlo el papel habría quedado mejor sujeto.','La mejora vendría del muelle, porque su mayor fuerza explicaría por sí sola la sujeción.','Los dos cambios habrían mejorado la sujeción por separado, porque juntos dieron buen resultado.'],
      correct:'a',explanation:'El resultado sería observable, pero dos cambios simultáneos impedirían distinguir cuál lo produjo o si actuaron juntos.'
    },
    'l008b-q4':{
      prompt:'¿Qué implica que la pinza siga siendo un «prototipo»?',
      options:['Es la versión definitiva, aunque aún deban copiar su diseño en el cuaderno.','Es el modelo descartado después de que la tela fallara en la ráfaga.','Es un modelo en evaluación al que todavía le faltan ensayos con papel grueso.','Es un modelo exclusivo para papel grueso que aún no se ha probado con papel fino.'],
      correct:'c',explanation:'El modelo se sigue evaluando. El resultado con el papel probado no sustituye los ensayos pendientes con otros grosores.',
      evidence:[{paragraph:5,text:'Llamaron prototipo al modelo de prueba. Faltaba ensayarlo con papeles más gruesos, como los de algunos dibujos.'}]
    },
    'l008b-q5':{
      prompt:'¿Por qué compararon tela y goma ante el mismo ventilador y a igual distancia?',
      options:['Para reproducir exactamente la ráfaga que había movido la cuerda del patio.','Para comprobar que ambos forros resistieran cualquier tipo de viento.','Para que diferencias en el aire no confundieran la comparación de los forros.','Para compensar el muelle más fuerte que habían puesto con la goma.'],
      correct:'c',explanation:'La ráfaga y el ventilador podían producir aire distinto. Usar el mismo ventilador y distancia hace comparables las dos pruebas de material.',
      evidence:[{paragraph:4,text:'El movimiento del aire podía ser distinto. Ensayaron por turnos tela y goma ante el mismo ventilador y a igual distancia.'}]
    },
    'l008b-q6':{
      prompt:'Un papel grueso permanece colgado, pero queda marcado. ¿Cómo se describe el resultado?',
      options:['Se logró proteger el borde, pero aún no sujetar el papel con ese grosor.','Se logró la sujeción, pero no la protección: el objetivo está parcialmente logrado.','Se logró el objetivo completo, porque el papel grueso no llegó a caerse.','No se puede valorar ninguna condición hasta probar otra intensidad de viento.'],
      correct:'b',explanation:'La sujeción y la protección son condiciones distintas. No caer cumple la primera; la marca muestra que la segunda sigue pendiente.',
      evidence:[{paragraph:1,text:'que el dibujo permaneciera colgado y que pudiera retirarse sin estropearlo'},{paragraph:5,text:'Si sujetaba una hoja gruesa pero la marcaba, habría superado solo una parte del objetivo.'}]
    }
  }},
  {code:'L008B',language:'ca',questions:{
    'l008b-q2':{
      prompt:'Quina limitació va mostrar la ràfega en el bon resultat de la roba?',
      options:['Amb la roba s’evitava el lliscament, però continuaven apareixent marques.','La roba protegia la vora, però no va impedir que el retall llisqués.','Amb la roba hi havia lliscament, però només en retirar la pinça del retall.','La roba evitava el lliscament després d’afegir-hi una segona capa.'],
      correct:'b',explanation:'La primera comparació mostrava protecció de la vora. La ràfega va evidenciar que aquell folre no evitava el lliscament.'
    },
    'l008b-q3':{
      prompt:'Si el resultat millora quan canvien alhora molla i roba, què podrien concloure sobre la causa?',
      options:['La millora vindria del folre, perquè en canviar-lo el paper hauria quedat més ben subjectat.','La millora vindria de la molla, perquè la seva força explicaria tota sola la subjecció.','No podrien atribuir-la a la molla, al folre o a la combinació de tots dos.','Tots dos canvis haurien millorat la subjecció per separat, perquè junts van donar bon resultat.'],
      correct:'c',explanation:'Podrien observar el resultat, però amb dos canvis alhora no sabrien quin l’ha causat o si depèn de la combinació.'
    },
    'l008b-q4':{
      prompt:'Què implica que la pinça continuï sent un «prototip»?',
      options:['És un model en avaluació que encara han d’assajar amb paper gruixut.','És la versió definitiva, tot i que han de copiar-ne el disseny a la llibreta.','És el model descartat quan la roba va fallar amb la ràfega del pati.','És un model només per a paper gruixut encara no provat amb paper prim.'],
      correct:'a',explanation:'Encara estan avaluant el model de prova. El resultat amb els retalls no garanteix què passarà amb els papers més gruixuts.',
      evidence:[{paragraph:5,text:'Van anomenar prototip el model de prova. Faltava assajar-lo amb papers més gruixuts, com els d’alguns dibuixos.'}]
    },
    'l008b-q5':{
      prompt:'Per què van comparar roba i goma davant del mateix ventilador i a igual distància?',
      options:['Per reproduir exactament la ràfega que havia mogut la corda al pati.','Per comprovar que tots dos folres resistissin qualsevol mena de vent.','Per compensar la molla més forta que havien col·locat amb la goma.','Per evitar que diferències en l’aire confonguessin la comparació dels folres.'],
      correct:'d',explanation:'L’aire de la ràfega podia ser diferent del del ventilador. Van mantenir ventilador i distància per comparar els materials en condicions semblants.',
      evidence:[{paragraph:4,text:'El moviment de l’aire podia ser diferent. Van assajar per torns roba i goma davant del mateix ventilador i a la mateixa distància.'}]
    },
    'l008b-q6':{
      prompt:'Un paper gruixut continua penjat, però queda marcat. Com es descriu el resultat?',
      options:['Han aconseguit la subjecció, però no la protecció: l’objectiu s’ha assolit en part.','Han aconseguit protegir la vora, però encara no subjectar el paper gruixut.','Han assolit tot l’objectiu perquè el paper gruixut no ha arribat a caure.','No es pot valorar cap condició fins a provar una altra intensitat de vent.'],
      correct:'a',explanation:'Mantenir el full penjat compleix la subjecció, però la marca impedeix donar per assolida la protecció. El resultat és parcial.',
      evidence:[{paragraph:1,text:'que el dibuix continués penjat i que es pogués retirar sense fer-lo malbé'},{paragraph:5,text:'Si subjectava un full gruixut però el marcava, hauria superat només una part de l’objectiu.'}]
    }
  }},
  {code:'L009',language:'es',questions:{
    'huellas-q2':{
      prompt:'Según el texto, ¿qué hay que medir para conocer una «zancada»?',
      options:['La distancia entre dos huellas seguidas de pies distintos en una fila.','La distancia entre la primera y la última huella de todo el rastro.','La distancia entre dos huellas consecutivas del mismo pie en una fila.','La longitud de una huella desde la punta de los dedos hasta el talón.'],
      correct:'c',explanation:'La guía compara dos huellas sucesivas del pie izquierdo: la zancada se mide entre dos apoyos consecutivos del mismo pie.'
    },
    'huellas-q3':{
      prompt:'¿Qué permiten sugerir las zancadas más largas y qué límite tiene esa información?',
      options:['Podían indicar aceleración, pero faltaban datos para estimar la velocidad.','Permitían calcular la velocidad, pero no saber si esta había cambiado.','Mostraban un cambio de dirección, pero no un cambio en la velocidad.','Permitían saber si los dos animales habían caminado juntos, pero no su velocidad.'],
      correct:'a',explanation:'Las zancadas más largas podían indicar que aceleraba. El texto mantiene abierta la estimación de velocidad porque hacen falta más datos.'
    },
    'huellas-q4':{
      prompt:'¿Qué conclusión permiten las dos filas y qué sigue sin saberse?',
      options:['Iban en la misma dirección y al mismo tiempo, porque las filas se parecen.','Pasaron en momentos distintos, pero se desconoce la dirección de ambos.','Iban en la misma dirección y la distancia entre filas indica que pasaron en fechas distintas.','Iban en la misma dirección, pero las huellas no indican cuándo pasó cada uno.'],
      correct:'d',explanation:'La orientación de los rastros muestra la dirección. No revela si se produjeron a la vez; uno pudo pasar mucho antes que el otro.'
    },
    'huellas-q5':{
      prompt:'¿Qué representan la flecha y el interrogante del dibujo de Vega?',
      options:['La flecha, la dirección; el interrogante, la velocidad de los dinosaurios.','La flecha, la velocidad; el interrogante, la dirección que habían seguido.','La flecha, la dirección; el interrogante, si los animales habían caminado juntos.','La flecha, la dirección; el interrogante, si las zancadas eran igual de largas.'],
      correct:'c',explanation:'Vega usa la flecha para la dirección conocida y el interrogante para la duda sobre si los dos animales iban juntos.'
    }
  }},
  {code:'L009',language:'ca',questions:{
    'huellas-q2':{
      prompt:'Segons el text, què cal mesurar per conèixer una «gambada»?',
      options:['La distància entre dues petjades seguides de peus diferents d’una filera.','La distància entre dues petjades consecutives del mateix peu d’una filera.','La distància entre la primera i l’última petjada de tot el rastre.','La llargada d’una petjada des de la punta dels dits fins al taló.'],
      correct:'b',explanation:'La guia assenyala dues petjades seguides del peu esquerre. La gambada va d’un suport d’un peu al suport següent d’aquell mateix peu.'
    },
    'huellas-q3':{
      prompt:'Què poden suggerir les gambades més llargues i quin límit té aquesta informació?',
      options:['Permeten calcular la velocitat, però no saber si havia canviat.','Mostren un canvi de direcció, però no un canvi en la velocitat.','Poden indicar acceleració, però falten dades per estimar-ne la velocitat.','Permeten saber si els animals caminaven junts, però no la seva velocitat.'],
      correct:'c',explanation:'Podien indicar que l’animal havia accelerat. Per estimar a quina velocitat anava, la guia diu que calien més dades.'
    },
    'huellas-q4':{
      prompt:'Què permeten concloure les dues fileres i què continua sense saber-se?',
      options:['Anaven en la mateixa direcció, però les petjades no indiquen quan va passar cadascun.','Anaven en la mateixa direcció i alhora, perquè les fileres s’assemblen.','Van passar en moments diferents, però es desconeix la direcció de tots dos.','Anaven en la mateixa direcció i la distància entre fileres indica dates diferents.'],
      correct:'a',explanation:'La direcció dels rastres coincideix, però no sabem si els animals hi van passar alhora. Un podia haver passat molt abans.'
    },
    'huellas-q5':{
      prompt:'Què representen la fletxa i l’interrogant del dibuix de la Vega?',
      options:['La fletxa, la direcció; l’interrogant, la velocitat dels dinosaures.','La fletxa, la direcció; l’interrogant, si les gambades eren igual de llargues.','La fletxa, la velocitat; l’interrogant, la direcció que havien seguit.','La fletxa, la direcció; l’interrogant, si els animals havien caminat junts.'],
      correct:'d',explanation:'La fletxa assenyala una direcció coneguda. L’interrogant marca el dubte sobre si els animals havien fet el camí plegats.'
    }
  }},
  {code:'L010',language:'es',questions:{
    'musculos-q2':{
      prompt:'¿Qué descripción de un «tendón» coincide con el texto?',
      options:['Une dos huesos y transmite la fuerza de un hueso al otro.','Une un músculo a un hueso y transmite al músculo la fuerza del hueso.','Une dos músculos y transmite la fuerza de uno al otro.','Une un músculo a un hueso y transmite al hueso la fuerza muscular.'],
      correct:'d',explanation:'El tendón une músculo y hueso. En el movimiento descrito transmite al hueso la fuerza que hace el músculo.'
    },
    'musculos-q3':{
      prompt:'¿Qué relación establece el texto entre los músculos y los dos gestos?',
      options:['Bíceps al doblar el codo; bíceps al estirarlo para empujar.','Tríceps al doblar el codo; bíceps al estirarlo para empujar.','Bíceps al doblar el codo; tríceps al estirarlo para empujar.','Tríceps al doblar el codo; tríceps al estirarlo para empujar.'],
      correct:'c',explanation:'En el gesto de doblar hace fuerza el bíceps; en el de estirar para empujar, el tríceps. Actúan desde posiciones que permiten sentidos opuestos.'
    },
    'musculos-q4':{
      prompt:'Si se rompe el cordón que endereza las tiras, ¿qué deja de mostrar el modelo al tirar de los cordones?',
      options:['Enderezar las tiras: el cordón que queda tira desde el lado que las dobla.','Doblar las tiras: el cordón que queda tira desde el lado que las endereza.','Ambos movimientos: hace falta tirar a la vez de los dos cordones.','Ninguno: basta con tirar más fuerte del cordón que todavía queda.'],
      correct:'a',explanation:'El cordón que se rompe representaba el tirón que endereza. El otro actúa desde el lado que dobla y no lo sustituye.'
    },
    'musculos-q5':{
      prompt:'¿Qué función cumple el último párrafo y qué detalle deja fuera el modelo?',
      options:['Completa el montaje: faltaba unir los cartones mediante el broche.','Aclara un límite: no representa los músculos que mantienen el hombro quieto.','Confirma su exactitud: en el brazo solo intervienen el bíceps y el tríceps.','Corrige el ejemplo: el cartón no puede representar cómo se estira el codo.'],
      correct:'b',explanation:'El último párrafo señala que el brazo real es más complejo. El modelo no incluye, por ejemplo, los músculos que estabilizan el hombro.'
    }
  }},
  {code:'L010',language:'ca',questions:{
    'musculos-q2':{
      prompt:'Quina descripció d’un «tendó» coincideix amb el text?',
      options:['Uneix un múscul a un os i transmet a l’os la força muscular.','Uneix dos ossos i transmet la força d’un os a l’altre.','Uneix un múscul a un os i transmet al múscul la força de l’os.','Uneix dos músculs i transmet la força de l’un a l’altre.'],
      correct:'a',explanation:'El tendó uneix múscul i os. En el moviment explicat transmet a l’os la força que fa el múscul.'
    },
    'musculos-q3':{
      prompt:'Quina relació estableix el text entre els músculs i els dos gestos?',
      options:['Tríceps en doblegar el colze; bíceps en estirar-lo per empènyer.','Bíceps en doblegar el colze; bíceps en estirar-lo per empènyer.','Tríceps en doblegar el colze; tríceps en estirar-lo per empènyer.','Bíceps en doblegar el colze; tríceps en estirar-lo per empènyer.'],
      correct:'d',explanation:'El text associa el bíceps al gest de doblegar el colze i el tríceps al d’estirar-lo per empènyer, des de costats oposats.'
    },
    'musculos-q4':{
      prompt:'Si es trenca el cordill que redreça les tires, què deixa de mostrar el model quan estirem els cordills?',
      options:['Doblegar les tires: el cordill que queda estira des del costat que les redreça.','Tots dos moviments: cal estirar els dos cordills alhora per fer-los.','Redreçar les tires: el cordill que queda estira des del costat que les doblega.','Cap moviment es perd: només cal estirar més fort el cordill que queda.'],
      correct:'c',explanation:'L’estirada del cordill trencat redreçava les tires. L’altre actua des del costat que les doblega i no pot substituir-lo.'
    },
    'musculos-q5':{
      prompt:'Quina funció fa l’últim paràgraf i quin detall queda fora del model?',
      options:['Completa el muntatge: faltava unir els cartrons amb el passador.','Confirma que és exacte: al braç només actuen el bíceps i el tríceps.','N’aclareix un límit: no representa els músculs que mantenen l’espatlla quieta.','Corregeix l’exemple: el cartró no pot representar com s’estira el colze.'],
      correct:'c',explanation:'El paràgraf recorda que el braç real és més complex. El model no representa, per exemple, els músculs que mantenen quieta l’espatlla.'
    }
  }},
];
