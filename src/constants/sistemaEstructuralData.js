import imgMurosConcreto from '../assets/fotos/01_Sistema_constructivo/muros_carga_concreto__Muros de carga en concreto.jpg';
import imgMampConfinada from '../assets/fotos/01_Sistema_constructivo/mamp_confinada__Mampostería confinada.jpg';
import imgMampEstructural from '../assets/fotos/01_Sistema_constructivo/mamp_estructural__Mampostería estructural (reforzada).jpg';
import imgMampSimple from '../assets/fotos/01_Sistema_constructivo/mamp_no_reforzada__Mampostería no reforzada o simple.jpg';
import imgConstTradicional from '../assets/fotos/01_Sistema_constructivo/tradicional__Construcción tradicional (bahareque, tapia pisada, adobe, guadua).jpg';
import imgConstPalafitica from '../assets/fotos/01_Sistema_constructivo/palafitica__Construcción palafítica.jpg';
import imgConstPrefab from '../assets/fotos/01_Sistema_constructivo/prefab__Construcción prefabricada.jpg';
import imgMaderaPesada from '../assets/fotos/01_Sistema_constructivo/madera_pesada__Madera pesada.jpg';
import imgEstMetalica from '../assets/fotos/01_Sistema_constructivo/estructura_metalica__Estructura metálica.jpg';
import imgOtroMixto from '../assets/fotos/01_Sistema_constructivo/otro__Otro - no sé identificar - mixto.jpg';

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

import imgCubiertaZinc from '../assets/fotos/02_Tipo_cubierta/liviana__Cubierta liviana o teja de zinc.jpg';
import imgCubiertaLosa from '../assets/fotos/02_Tipo_cubierta/lisa__Cubierta lisa.jpg';
import imgTejaBarro from '../assets/fotos/02_Tipo_cubierta/barro__Teja de barro.jpg';
import imgTechoOrganico from '../assets/fotos/02_Tipo_cubierta/organico__Techo orgánico.jpg';

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
