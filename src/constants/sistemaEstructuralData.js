import imgMurosConcreto from '../assets/fotos/06_Sistemas_constructivos/1_Muros_carga_concreto.png';
import imgMampConfinada from '../assets/fotos/06_Sistemas_constructivos/2_Mamposteria_confinada.png';
import imgMampEstructural from '../assets/fotos/06_Sistemas_constructivos/3_Mamposteria_estructural_reforzada.png';
import imgMampSimple from '../assets/fotos/06_Sistemas_constructivos/4_Mamposteria_no_reforzada_simple.png';
import imgConstTradicional from '../assets/fotos/06_Sistemas_constructivos/5_Construccion_tradicional_bahareque_tapia_adobe_guadua.png';
import imgConstPalafitica from '../assets/fotos/06_Sistemas_constructivos/6_Construccion_palafitica.png';
import imgConstPrefab from '../assets/fotos/06_Sistemas_constructivos/7_Construccion_prefabricada.png';
import imgMaderaPesada from '../assets/fotos/06_Sistemas_constructivos/8_Madera_pesada.png';
import imgEstMetalica from '../assets/fotos/06_Sistemas_constructivos/9_Estructura_metalica.png';
import imgOtroMixto from '../assets/fotos/06_Sistemas_constructivos/10_Otro_mixto_no_se_identificar.png';

export const CONSTRUCCION_OPTIONS = {
  muros_concreto: {
    id: 'muros_concreto',
    titulo: 'Muros de carga en concreto',
    descripcion: 'Paredes gruesas y continuas de concreto, sin columnas independientes a la vista.',
    imageSrc: imgMurosConcreto
  },
  mamposteria_confinada: {
    id: 'mamposteria_confinada',
    titulo: 'Mampostería confinada',
    descripcion: 'Ladrillo o bloque bordeado por una franja delgada de concreto (columnas y vigas de amarre).',
    imageSrc: imgMampConfinada
  },
  mamposteria_estructural: {
    id: 'mamposteria_estructural',
    titulo: 'Mampostería estructural (reforzada)',
    descripcion: 'Bloque de concreto o ladrillo con varillas de acero por dentro, sin marco visible en los bordes.',
    imageSrc: imgMampEstructural
  },
  mamposteria_simple: {
    id: 'mamposteria_simple',
    titulo: 'Mampostería no reforzada o simple',
    descripcion: 'Ladrillo o bloque sin ninguna franja de concreto en los bordes y sin varillas de acero por dentro.',
    imageSrc: imgMampSimple
  },
  construccion_tradicional: {
    id: 'construccion_tradicional',
    titulo: 'Construcción tradicional (bahareque, tapia pisada, adobe, guadua)',
    descripcion: 'Materiales de la zona: guadua, caña, madera, tierra, adobe o tierra pisada (tapia).',
    imageSrc: imgConstTradicional
  },
  construccion_palafitica: {
    id: 'construccion_palafitica',
    titulo: 'Construcción palafítica',
    descripcion: 'Construcción elevada sobre estacas o pilotes de madera, por encima del agua o de suelo inundable o en contacto de arroyos.',
    imageSrc: imgConstPalafitica
  },
  construccion_prefabricada: {
    id: 'construccion_prefabricada',
    titulo: 'Construcción prefabricada',
    descripcion: 'Paredes grandes ya fabricadas que se ensamblan en obra sobre perfiles metálicos, se notan las juntas entre paneles.',
    imageSrc: imgConstPrefab
  },
  madera_portante: {
    id: 'madera_portante',
    titulo: 'Madera pesada',
    descripcion: 'Postes y vigas de madera gruesa, separadas y a la vista, sin recubrimiento.',
    imageSrc: imgMaderaPesada
  },
  estructura_metalica: {
    id: 'estructura_metalica',
    titulo: 'Estructura metálica',
    descripcion: 'Columnas y vigas de acero.',
    imageSrc: imgEstMetalica
  },
  otro_mixto: {
    id: 'otro_mixto',
    titulo: 'Otro, / no sé identificar / mixto',
    descripcion: 'No encaja en las anteriores, o combina varias.',
    imageSrc: imgOtroMixto
  }
};

import imgCubiertaZinc from '../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_cubierta/1_Cubierta_liviana_teja_zinc.png';
import imgCubiertaLosa from '../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_cubierta/2_Cubierta_lisa.png';
import imgTejaBarro from '../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_cubierta/3_Teja_de_barro.png';
import imgTechoOrganico from '../assets/fotos/04_Pisos_y_cubiertas/Tipo_de_cubierta/4_Techo_organico.png';

export const CUBIERTA_OPTIONS = {
  cubierta_liviana_zinc: {
    id: 'cubierta_liviana_zinc',
    titulo: 'Cubierta liviana o teja de zinc',
    descripcion: 'Teja de cualquier color plástica o metálica.',
    imageSrc: imgCubiertaZinc
  },
  cubierta_losa: {
    id: 'cubierta_losa',
    titulo: 'Cubierta losa',
    descripcion: 'Placa plana, sin ondas ni tejas como una losa de concreto.',
    imageSrc: imgCubiertaLosa
  },
  teja_barro: {
    id: 'teja_barro',
    titulo: 'Teja de barro',
    descripcion: 'Teja de arcilla en ondas rojizas o naranjas traslapadas.',
    imageSrc: imgTejaBarro
  },
  techo_organico: {
    id: 'techo_organico',
    titulo: 'Techo orgánico',
    descripcion: 'Paja o palma tejida.',
    imageSrc: imgTechoOrganico
  }
};
