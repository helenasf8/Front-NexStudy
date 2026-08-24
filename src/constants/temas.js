export const TEMAS = [
  { codigo: 'AZUL', nome: 'Azul', gradient: 'linear-gradient(135deg, #4f6df5, #6c4ef5)' },
  { codigo: 'ROXO', nome: 'Roxo', gradient: 'linear-gradient(135deg, #b347e8, #d347c9)' },
  { codigo: 'VERDE', nome: 'Verde', gradient: 'linear-gradient(135deg, #16c47f, #0ea968)' },
  { codigo: 'LARANJA', nome: 'Laranja', gradient: 'linear-gradient(135deg, #ff7a1a, #ff9500)' },
  { codigo: 'ROSA', nome: 'Rosa', gradient: 'linear-gradient(135deg, #f0328a, #f6339a)' },
  { codigo: 'CIANO', nome: 'Ciano', gradient: 'linear-gradient(135deg, #1ab9e8, #38c6f4)' },
];

export function gradientDoTema(codigo) {
  return TEMAS.find((t) => t.codigo === codigo)?.gradient ?? TEMAS[0].gradient;
}