/* Dados do check-list (edite à vontade aqui) */
window.CHECKLIST_ITEMS = [
  { id: "portas",     local: "Portas de acesso restrito",      desc: "CPD, sala dos elevadores, terraço — verificar se estão fechadas.",                 periodicidade: "diaria",    tipo: "ok_nok" },
  { id: "bomba_aud",  local: "Bomba de drenagem do auditório", desc: "Condição da bomba; automático ou manual; bomba 1 ou bomba 2.",                     periodicidade: "quinzenal", tipo: "bomba" },
  { id: "elev_pcd",   local: "Elevador PCD",                   desc: "Verificar o funcionamento do elevador.",                                           periodicidade: "semanal",   tipo: "ok_nok" },
  { id: "bomba_esg",  local: "Bomba de drenagem do esgoto",    desc: "Condição da bomba; automático ou manual; bomba 1 ou bomba 2.",                     periodicidade: "mensal",    tipo: "bomba" },
  { id: "subest",     local: "Sub-estação",                    desc: "Condição do ambiente e se as estações estão fechadas.",                            periodicidade: "bimestral", tipo: "condicao" },
  { id: "cisterna",   local: "Cisterna",                       desc: "Nível de água.",                                                                   periodicidade: "quinzenal", tipo: "nivel" },
  { id: "banheiros",  local: "Banheiros",                      desc: "Vazamentos, vasos sanitários, trincos na estrutura ou portas.",                    periodicidade: "quinzenal", tipo: "ok_nok" },
  { id: "calhas",     local: "Terraço e 1º andar — calhas",    desc: "Verificar as calhas e realizar a limpeza.",                                        periodicidade: "quinzenal", tipo: "limpeza" },
  { id: "hidrometro", local: "Hidrômetro",                     desc: "Verificar se está aberto ou fechado e registrar a numeração.",                     periodicidade: "semanal",   tipo: "hidrometro" },
  { id: "cx_gordura", local: "Caixa de gordura — gastronomia", desc: "Condição da caixa e realizar limpeza.",                                            periodicidade: "semanal",   tipo: "limpeza" },
  { id: "cx_agua",    local: "Caixa d'água",                   desc: "Verificar a condição e o nível de água.",                                          periodicidade: "semanal",   tipo: "nivel" },
  { id: "cpd",        local: "CPD",                            desc: "Verificar se o ar e as câmeras estão funcionando.",                                periodicidade: "semanal",   tipo: "cpd" },
  { id: "poco_elev",  local: "Poço do elevador",               desc: "Verificar a condição.",                                                            periodicidade: "mensal",    tipo: "condicao" },
  { id: "elev_cist",  local: "Elevatória da cisterna",         desc: "Condição da bomba; automático ou manual; bomba 1 ou bomba 2.",                     periodicidade: "bimestral", tipo: "bomba" },  
];
