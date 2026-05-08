/* Dados do check-list (edite à vontade aqui) */
window.CHECKLIST_ITEMS = [
  { id: "portas",     local: "Verificação de portas • Acessos restritos",      desc: "As portas estão devidamente fechadas? <br> Espaços: CPD, sala dos elevadores, terraço, acessos restritos",     periodicidade: "diaria",    tipo: "ok_nok" },
  { id: "bomba_aud",  local: "Bomba de drenagem • Auditório",                  desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "quinzenal", tipo: "bomba" },
  { id: "elev_pcd",   local: "Elevador PCD",                                   desc: "Verificar o funcionamento do elevador. <br> Há algum problema?",                               periodicidade: "semanal",   tipo: "ok_nok" },
  { id: "bomba_esg",  local: "Bomba de drenagem do esgoto • Poço logmans",     desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "mensal",    tipo: "bomba" },
  { id: "subest",     local: "Sala da Sub-estação de energia • SUBSOLO",       desc: "As estações de energia estão devidamente fechadas? <br> O ambiente está em boas condições?",    periodicidade: "bimestral", tipo: "condicao" },
  { id: "cisterna",   local: "Cisterna",                                       desc: "Verificar a condição do ambiente e o nível de água.",                  periodicidade: "quinzenal", tipo: "nivel" },
  { id: "banheiros",  local: "Banheiros",                                      desc: "Averiguar se há vazamentos, equipamentos danificados ou problemas em: vasos sanitários, trincos em portas ou estrutura. <br> O ambiente está em boas condições?",        periodicidade: "quinzenal", tipo: "ok_nok" },
  { id: "calhas",     local: "Inspeção das calhas • Terraço e 1º andar",       desc: "Verificar as calhas e realizar a limpeza.",                            periodicidade: "quinzenal", tipo: "limpeza" },
  { id: "hidrometro", local: "Hidrômetro",                                     desc: "Verificar se está aberto ou fechado e registrar a numeração.",         periodicidade: "semanal",   tipo: "hidrometro" },
  { id: "cx_gordura", local: "Caixa de gordura • gastronomia",                 desc: "Verificar a condição da caixa. <br> É necessário a limpeza?",                                periodicidade: "semanal",   tipo: "limpeza" },
  { id: "cx_agua",    local: "Caixa d'água • Terraço",                         desc: "Verificar a condição e o nível de água.",                              periodicidade: "semanal",   tipo: "nivel" },
  { id: "cpd",        local: "Inspeção do <strong>CPD</strong>",               desc: "Verificar o ar. <br> As câmeras estão funcionando?<br> É necessário alguma intervenção?",                    periodicidade: "semanal",   tipo: "cpd" },
  { id: "poco_elev",  local: "Poço do elevador",                               desc: "Verificar a condição.",                                                periodicidade: "mensal",    tipo: "condicao" },
  { id: "elev_cist",  local: "Elevatória da cisterna",                         desc: "Relatar o funcionamento;<br> Condições: <br> - Automático ou manual;<br> - bomba 1 ou bomba 2.",         periodicidade: "bimestral", tipo: "bomba" },  
];
