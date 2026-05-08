/* Dados do check-list (edite à vontade aqui) */
window.CHECKLIST_ITEMS = [
  { id: "portas",     local: "Verificação de portas <br>— Acesso restrito",      desc: "As portas estão devidamente fechadas? <br> Espaços: CPD, sala dos elevadores, terraço, acessos restritos",     periodicidade: "diaria",    tipo: "ok_nok" },
  { id: "bomba_aud",  local: "Bomba de drenagem <br>— Auditório",                desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "quinzenal", tipo: "bomba" },
  { id: "elev_pcd",   local: "Funcionamento do <br> Elevador PCD",               desc: "Verificar o funcionamento do elevador. <br> Há algum problema?",                               periodicidade: "semanal",   tipo: "ok_nok" },
  { id: "bomba_esg",  local: "Bomba de drenagem do esgoto <br>— Poço logmans",   desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "mensal",    tipo: "bomba" },
  { id: "subest",     local: "Condição da Sub-estação",                          desc: "As estações de energia estão devidamente fechadas? <br> O ambiente está em boas condições?",    periodicidade: "bimestral", tipo: "condicao" },
  { id: "cisterna",   local: "Inspeção da Cisterna",                             desc: "Verificar a condição do ambiente e o nível de água.",                  periodicidade: "quinzenal", tipo: "nivel" },
  { id: "banheiros",  local: "Inspeção dos Banheiros",                           desc: "Averiguar se há vazamentos, equipamentos danificados ou problemas em: vasos sanitários, trincos em portas ou estrutura. <br> O ambiente está em boas condições?",        periodicidade: "quinzenal", tipo: "ok_nok" },
  { id: "calhas",     local: "Inspeção das calhas <br>— Terraço e 1º andar",     desc: "Verificar as calhas e realizar a limpeza.",                            periodicidade: "quinzenal", tipo: "limpeza" },
  { id: "hidrometro", local: "Verificação do Hidrômetro",                        desc: "Verificar se está aberto ou fechado e registrar a numeração.",         periodicidade: "semanal",   tipo: "hidrometro" },
  { id: "cx_gordura", local: "Condição da caixa de gordura — gastronomia",       desc: "Verificar a condição da caixa. <br> É necessário a limpeza?",                                periodicidade: "semanal",   tipo: "limpeza" },
  { id: "cx_agua",    local: "Condição da caixa d'água <br>— Terraço",           desc: "Verificar a condição e o nível de água.",                              periodicidade: "semanal",   tipo: "nivel" },
  { id: "cpd",        local: "Inspeção do CPD",                                  desc: "Verificar o ar. <br> As câmeras estão funcionando?<br> É necessário alguma intervenção?",                    periodicidade: "semanal",   tipo: "cpd" },
  { id: "poco_elev",  local: "Limpeza do poço do elevador",                      desc: "Verificar a condição.",                                                periodicidade: "mensal",    tipo: "condicao" },
  { id: "elev_cist",  local: "Funcionamento da elevatória da cisterna",          desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "bimestral", tipo: "bomba" },  
];
