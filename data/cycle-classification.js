// Editorial cycle classification v2, 2026-11-27; teacher corrections in v1.65.1.
// Codes identify editions, not languages.
// Original grade/difficulty fields and all reading content remain unchanged.
// Criteria and boundary decisions: docs/cycle-classification.md.
import { cycleCompletionAssignments } from './cycle-completion.js';
export const cycleAssignments = [
  ['primary-cycle-1', 'intermediate', [
    'L104A', 'L105A', 'L106A', 'L107A', 'L108A', 'L109A', 'L110A', 'L111A', 'L112A', 'L113A', 'L123A', 'L125A',
    'L126A', 'L127A', 'L128A', 'L129A', 'L130A', 'L133A', 'L136A', 'L138A', 'L139A', 'L140A', 'L141A', 'L145A',
    'L148A', 'L149A', 'L150A', 'L155A',
  ]],
  ['primary-cycle-2', 'initial', [
    'L021A', 'L023A', 'L025A', 'L026A', 'L027A', 'L032A', 'L033A', 'L104', 'L105', 'L106', 'L107', 'L108',
    'L109', 'L110', 'L111', 'L112', 'L113', 'L123', 'L124', 'L125', 'L126', 'L127', 'L128', 'L129',
    'L130', 'L131', 'L132', 'L133', 'L134', 'L135', 'L136', 'L137', 'L138', 'L139', 'L140', 'L141',
    'L142', 'L166A', 'L168A', 'L169A', 'L171A', 'L172A', 'L174A', 'L175A', 'L180A', 'L289A', 'L290A', 'L291A',
    'L292A', 'L293A', 'L294A', 'L295A', 'L296A', 'L297A',
  ]],
  ['primary-cycle-2', 'intermediate', [
    'L001A', 'L002A', 'L003A', 'L005A', 'L006A', 'L008A', 'L021', 'L022', 'L023', 'L024', 'L025', 'L026',
    'L027', 'L028', 'L028A', 'L029', 'L030', 'L031', 'L031A', 'L032', 'L033', 'L034', 'L035', 'L036',
    'L037', 'L037A', 'L039A', 'L041A', 'L043A', 'L044A', 'L045A', 'L046A', 'L048A', 'L049A', 'L050A', 'L052A',
    'L053A', 'L054A', 'L055A', 'L057A', 'L060A', 'L065A', 'L077A', 'L104B', 'L105B', 'L106B', 'L107B', 'L108B',
    'L109B', 'L110B', 'L111B', 'L112B', 'L113B', 'L114A', 'L115A', 'L117A', 'L118A', 'L119A', 'L120A', 'L122A',
    'L123B', 'L125B', 'L126B', 'L127B', 'L128B', 'L129B', 'L130B', 'L133B', 'L136B', 'L138B', 'L139B', 'L140B',
    'L141B', 'L143', 'L144', 'L145', 'L145B', 'L146', 'L147', 'L148', 'L148B', 'L149', 'L149B', 'L150',
    'L150B', 'L151', 'L152', 'L153', 'L154', 'L155', 'L156', 'L157', 'L158A', 'L159A', 'L162A', 'L165',
    'L166', 'L167', 'L168', 'L169', 'L170', 'L171', 'L172', 'L173', 'L174', 'L175', 'L176', 'L177',
    'L177A', 'L178', 'L179', 'L179A', 'L180', 'L182A', 'L183', 'L183A', 'L184A', 'L186A', 'L187A', 'L208A',
    'L249', 'L251', 'L254', 'L289', 'L290', 'L291', 'L292', 'L293', 'L294', 'L295', 'L296', 'L297',
    'L298A', 'L299A', 'L300A', 'L301A', 'L302A', 'L303A', 'L304A', 'L305A', 'L306A', 'L307A', 'L308A', 'L309A',
    'L310A', 'L311A', 'L312A', 'L313A', 'L314A', 'L315A',
  ]],
  ['primary-cycle-2', 'advanced', [
    'L004A', 'L038', 'L039', 'L040', 'L155B', 'L181', 'L182', 'L184', 'L185', 'L186', 'L187', 'L188',
    'L189', 'L250', 'L255',
  ]],
  ['primary-cycle-3', 'initial', [
    'L001', 'L002', 'L003', 'L005', 'L006', 'L007', 'L009', 'L010', 'L012', 'L013', 'L014', 'L016',
    'L018', 'L019', 'L020', 'L021B', 'L023B', 'L025B', 'L026B', 'L027B', 'L028B', 'L031B', 'L032B', 'L033B',
    'L041', 'L042', 'L043', 'L044', 'L045', 'L046', 'L047', 'L048', 'L049', 'L050', 'L051', 'L052',
    'L053', 'L054', 'L055', 'L058', 'L060', 'L065', 'L066', 'L067', 'L068', 'L069', 'L072', 'L076',
    'L077', 'L080', 'L082A', 'L083A', 'L084A', 'L085A', 'L086A', 'L087A', 'L088A', 'L089A', 'L090A', 'L091A',
    'L092A', 'L093A', 'L094A', 'L095A', 'L096A', 'L114', 'L115', 'L116', 'L117', 'L118', 'L119', 'L120',
    'L121', 'L122', 'L166B', 'L168B', 'L169B', 'L171B', 'L172B', 'L174B', 'L177B', 'L180B', 'L202A', 'L204A',
    'L205A', 'L206A', 'L207A', 'L252', 'L253', 'L256', 'L257', 'L258', 'L264', 'L265', 'L267', 'L280A',
    'L281A', 'L282A', 'L283A', 'L284A', 'L285A', 'L286A', 'L287A', 'L288A', 'L289B', 'L290B', 'L291B', 'L292B',
    'L293B', 'L294B', 'L295B', 'L296B', 'L297B', 'L298', 'L299', 'L300', 'L301', 'L302', 'L303', 'L304',
    'L305', 'L306', 'L307', 'L308', 'L309', 'L310', 'L311', 'L312', 'L313', 'L314', 'L315',
  ]],
  ['primary-cycle-3', 'intermediate', [
    'L001B', 'L002B', 'L003B', 'L004', 'L005B', 'L006B', 'L008', 'L011', 'L015', 'L017', 'L037B', 'L039B',
    'L041B', 'L043B', 'L044B', 'L045B', 'L046B', 'L048B', 'L049B', 'L050B', 'L052B', 'L053B', 'L054B', 'L055B',
    'L056', 'L057', 'L057B', 'L059', 'L060B', 'L061', 'L062', 'L063', 'L064', 'L065B', 'L070', 'L071',
    'L073', 'L074', 'L075', 'L077B', 'L078', 'L079', 'L081', 'L114B', 'L115B', 'L117B', 'L118B', 'L119B',
    'L120B', 'L122B', 'L158', 'L158B', 'L159', 'L159B', 'L160', 'L161', 'L162', 'L163', 'L164', 'L175B',
    'L179B', 'L182B', 'L183B', 'L184B', 'L186B', 'L187B', 'L190', 'L191', 'L192', 'L193', 'L194', 'L195',
    'L196', 'L197', 'L198', 'L199', 'L200', 'L201', 'L202', 'L203', 'L203A', 'L204', 'L205', 'L207',
    'L208B', 'L260', 'L262', 'L266', 'L268', 'L269A', 'L270A', 'L271A', 'L272A', 'L273A', 'L274A', 'L275A',
    'L276A', 'L277A', 'L278A', 'L279A', 'L280', 'L281', 'L282', 'L283', 'L284', 'L285', 'L286', 'L287',
    'L288', 'L298B', 'L299B', 'L300B', 'L301B', 'L302B', 'L303B', 'L304B', 'L305B', 'L306B', 'L307B', 'L308B',
    'L309B', 'L310B', 'L311B', 'L312B', 'L313B',
  ]],
  ['primary-cycle-3', 'advanced', [
    'L004B', 'L008B', 'L082', 'L083', 'L084', 'L085', 'L086', 'L087', 'L088', 'L089', 'L090', 'L091',
    'L092', 'L093', 'L094', 'L095', 'L096', 'L162B', 'L206', 'L259', 'L261', 'L263', 'L314B', 'L315B',
  ]],
  ['secondary-cycle-1', 'initial', [
    'L082B', 'L083B', 'L084B', 'L085B', 'L086B', 'L087B', 'L088B', 'L089B', 'L090B', 'L091B', 'L092B', 'L093B',
    'L094B', 'L095B', 'L096B', 'L202B', 'L203B', 'L204B', 'L205B', 'L206B', 'L207B', 'L208', 'L209', 'L210',
    'L211', 'L212', 'L213', 'L214', 'L215', 'L216', 'L217', 'L218', 'L219', 'L220', 'L221', 'L222',
    'L246', 'L247', 'L248',
  ]],
  ['secondary-cycle-1', 'intermediate', [
    'L097', 'L223', 'L224', 'L225', 'L226', 'L227', 'L228', 'L229', 'L230', 'L231', 'L232', 'L233',
    'L234', 'L235', 'L236', 'L269', 'L270', 'L271', 'L272', 'L273', 'L274', 'L275', 'L276', 'L277',
    'L278', 'L279', 'L280B', 'L281B', 'L282B', 'L283B', 'L284B', 'L285B', 'L286B', 'L287B', 'L288B',
  ]],
  ['secondary-cycle-1', 'advanced', [
    'L098', 'L099', 'L100', 'L101', 'L102', 'L103', 'L237', 'L238', 'L239', 'L240', 'L241', 'L242',
    'L243', 'L244', 'L245', 'L269B', 'L270B', 'L271B', 'L272B', 'L273B', 'L274B', 'L275B', 'L276B', 'L277B',
    'L278B', 'L279B',
  ]],
  ...cycleCompletionAssignments,
];

export const cycleClassificationNotes = {
  "L008A": {
    "difficulty": "intermediate",
    "reason": "La tècnica i el motiu de la pinça s'expliciten; les inferències són locals."
  },
  "L035": {
    "difficulty": "intermediate",
    "reason": "Passos numerats i una inferència de funció accessible, sense integració sostinguda de pistes."
  },
  "L036": {
    "difficulty": "intermediate",
    "reason": "Dues solucions per a dos grups d'invitacions; les raons ja són explícites."
  },
  "L037": {
    "difficulty": "intermediate",
    "reason": "Cinc preguntes amb relacions de vent, tapa, ubicació i recompte explicades al text."
  },
  "L054A": {
    "difficulty": "intermediate",
    "reason": "L'exemple d'escala resolt guia una única transferència de 6 per 5; intermedi alt."
  },
  "L065A": {
    "difficulty": "intermediate",
    "reason": "La cautela i les condicions estan explicitades; inferències locals."
  },
  "L077A": {
    "difficulty": "intermediate",
    "reason": "Dues inferències locals, informació explícita i alternatives ABCD separables."
  },
  "L183": {
    "difficulty": "intermediate",
    "reason": "Les preguntes recuperen instruccions i motius explícits; només una integració condicional final."
  },
  "L057B": {
    "difficulty": "intermediate",
    "reason": "Les inferències recuperen delimitacions expressades a l'entrevista i al final; no exigeixen construir un model complex."
  },
  "L206": {
    "difficulty": "advanced",
    "reason": "Cal separar moviment de matèria i posició d'un límit, conservar dues variacions simultànies i interpretar l'abast de l'analogia i les fotografies."
  },
  "L314B": {
    "difficulty": "advanced",
    "reason": "Doble ordre d'història i representació; distinció actor/personatge i coneixement desigual del públic, amb transferència final."
  },
  "L315B": {
    "difficulty": "advanced",
    "reason": "Cal relacionar símbol personal i convenció, sons, gestos i llegenda; interpretar un buit i el canvi de lectura d'Elna amb pistes separades."
  }
};
