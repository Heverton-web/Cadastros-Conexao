import psycopg2
import uuid

conn = psycopg2.connect(
    host='db.cluuqzhizeqvkgvfdisx.supabase.co',
    database='postgres',
    user='postgres',
    password='@#Khen741963@#',
    port=5432,
    sslmode='require'
)
cur = conn.cursor()

empresas = [
    ('6687e2f0-1ff6-406d-b621-7927764f121a', 'Conexao'),
    ('1a00d0fe-0d10-48b2-aff7-68e941967f0f', 'Empresa Teste'),
]

results = {}

for eid, ename in empresas:
    print(f'--- {ename} ---')
    counts = {}

    # 1. Categorias
    cat_ids = []
    for nome, sigla in [('Implante', 'IMP'), ('Componente', 'COMP'), ('Instrumental', 'INST')]:
        cid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_categorias (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (cid, eid, nome, sigla))
        cat_ids.append(cid)
    counts['categorias'] = len(cat_ids)

    # 2. Conexoes
    conn_ids = []
    for nome, sigla in [('Internal Hex', 'IH'), ('External Hex', 'EH'), ('Conical', 'CON')]:
        cid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_ips_conexoes (id, empresa_id, categoria_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, %s, true)', (cid, eid, cat_ids[0], nome, sigla))
        conn_ids.append(cid)
    counts['conexoes'] = len(conn_ids)

    # 3. Familias
    fam_ids = []
    for nome, conn_idx in [('Standard', 0), ('Narrow', 0), ('Wide', 1), ('Tapered', 2)]:
        fid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_ips_familias (id, empresa_id, conexao_id, nome, cor_identificacao, ativo) VALUES (%s, %s, %s, %s, %s, true)', (fid, eid, conn_ids[conn_idx], nome, '#c9a655'))
        fam_ids.append(fid)
    counts['familias'] = len(fam_ids)

    # 4. Linhas
    lin_ids = []
    for nome, fam_idx in [('Evolution', 0), ('Nexus', 0), ('ProLine', 1), ('Elite', 2)]:
        lid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_ips_linhas (id, empresa_id, familia_id, nome, ativo) VALUES (%s, %s, %s, %s, true)', (lid, eid, fam_ids[fam_idx], nome))
        lin_ids.append(lid)
    counts['linhas'] = len(lin_ids)

    # 5. Tipos Reabilitacao
    tr_ids = []
    for nome, sigla in [('Coroa', 'COR'), ('Ponte', 'PON'), ('Overdenture', 'OD')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_cps_tipos_reabilitacao (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
        tr_ids.append(tid)
    counts['tipos_reab'] = len(tr_ids)

    # 6. Tipos Abutment
    tab_ids = []
    for nome, sigla in [('Reto', 'RET'), ('Angulado 15', 'ANG15'), ('Angulado 25', 'ANG25')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_cps_tipos_abutments (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
        tab_ids.append(tid)
    counts['tipos_abutment'] = len(tab_ids)

    # 7. Tipos Chaves
    tc_ids = []
    for nome, sigla in [('Chave Hex 1.2', 'H12'), ('Chave Hex 1.5', 'H15'), ('Chave Torx', 'TORX')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_tipos_chaves (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
        tc_ids.append(tid)
    counts['tipos_chaves'] = len(tc_ids)

    # 8. Tipos Fresas
    tf_ids = []
    for nome, sigla in [('Fresa Piloto', 'FP'), ('Fresa Limpeza', 'FL'), ('Fresa Osteotomia', 'FO')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_tipos_fresas (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
        tf_ids.append(tid)
    counts['tipos_fresas'] = len(tf_ids)

    # 9. Tipos Complementares
    for nome, sigla in [('Parafuso de Cobertura', 'PC'), ('Transferente', 'TRANS')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_tipos_complementares (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
    counts['tipos_complementares'] = 2

    # 10. Tipos Opcionais
    for nome, sigla in [('Molde de Impressao', 'MI'), ('Corpo de Prova', 'CP')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_tipos_opcionais (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
    counts['tipos_opcionais'] = 2

    # 11. Tipos Kit
    tk_ids = []
    for nome, sigla in [('Cirurgico', 'CIR'), ('Protese', 'PROT'), ('Completo', 'COMP')]:
        tid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_tipos_kits (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (tid, eid, nome, sigla))
        tk_ids.append(tid)
    counts['tipos_kits'] = len(tk_ids)

    # 12. Workflows
    wf_ids = []
    for nome, sigla in [('Fluxo Padrao', 'FPAD'), ('Fluxo Urgente', 'FURG')]:
        wid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_cps_tipos_workflows (id, empresa_id, nome, sigla, ativo) VALUES (%s, %s, %s, %s, true)', (wid, eid, nome, sigla))
        wf_ids.append(wid)
    counts['workflows'] = len(wf_ids)

    # 13. Etapas Workflow
    et_count = 0
    for wf_id in wf_ids:
        for ordem, nome in [(1, 'Analise'), (2, 'Aprovacao'), (3, 'Producao')]:
            eid2 = str(uuid.uuid4())
            cur.execute('INSERT INTO catalogo_cps_etapas_workflows (id, empresa_id, tipo_workflow_id, ordem, nome, sigla, ativo) VALUES (%s, %s, %s, %s, %s, %s, true)', (eid2, eid, wf_id, ordem, nome, f'E{ordem}'))
            et_count += 1
    counts['etapas_workflow'] = et_count

    # 14. Parafusos
    for sku, nome, torque in [('PAR-001', 'Parafuso Retencao 1.5mm', 15), ('PAR-002', 'Parafuso Retencao 2.0mm', 20)]:
        cur.execute('INSERT INTO catalogo_parafusos (sku, empresa_id, nome, torque_ncm, ativo) VALUES (%s, %s, %s, %s, true)', (sku, eid, nome, torque))
    counts['parafusos'] = 2

    # 15. Cicatrizadores
    for sku, nome, diam, altura in [('CIC-001', 'Cicatrizador 3.5mm', 3.5, 3), ('CIC-002', 'Cicatrizador 4.3mm', 4.3, 4)]:
        cur.execute('INSERT INTO catalogo_cicatrizadores (sku, empresa_id, nome, diametro_plataforma_mm, altura_transmucoso_mm, ativo) VALUES (%s, %s, %s, %s, %s, true)', (sku, eid, nome, diam, altura))
    counts['cicatrizadores'] = 2

    # 16. Chaves
    for sku, nome, preco in [('CHV-001', 'Chave Hex 1.2mm', 89.90), ('CHV-002', 'Chave Hex 1.5mm', 99.90), ('CHV-003', 'Chave Torx T6', 119.90)]:
        cur.execute('INSERT INTO catalogo_chaves (sku, empresa_id, nome, preco, ativo) VALUES (%s, %s, %s, %s, true)', (sku, eid, nome, preco))
    counts['chaves'] = 3

    # 17. Fresas
    for sku, nome, preco in [('FRS-001', 'Fresa Piloto 2.0mm', 45.90), ('FRS-002', 'Fresa Limpeza 3.0mm', 55.90)]:
        cur.execute('INSERT INTO catalogo_fresas (sku, empresa_id, nome, preco, ativo) VALUES (%s, %s, %s, %s, true)', (sku, eid, nome, preco))
    counts['fresas'] = 2

    # 18. Implantes
    imp_skus = []
    for sku, linha_idx, diam, comp in [('IMP-001', 0, 3.5, 10), ('IMP-002', 0, 4.0, 12), ('IMP-003', 1, 3.8, 11)]:
        cur.execute('INSERT INTO catalogo_implantes (sku, empresa_id, linha_id, diametro_mm, comprimento_mm, preco, ativo) VALUES (%s, %s, %s, %s, %s, %s, true)', (sku, eid, lin_ids[linha_idx], diam, comp, 450.00))
        imp_skus.append(sku)
    counts['implantes'] = len(imp_skus)

    # 19. Abutments
    for sku, fam_idx, tr_idx, tab_idx in [('ABT-001', 0, 0, 0), ('ABT-002', 1, 0, 1)]:
        cur.execute('INSERT INTO catalogo_abutments (sku, empresa_id, familia_id, tipo_reabilitacao_id, tipo_abutment_id, preco, ativo) VALUES (%s, %s, %s, %s, %s, %s, true)', (sku, eid, fam_ids[fam_idx], tr_ids[tr_idx], tab_ids[tab_idx], 320.00))
    counts['abutments'] = 2

    # 20. Kits
    kit_skus = []
    for sku, nome, cat_idx, preco in [('KIT-001', 'Kit Cirurgico Basico', 0, 1200.00), ('KIT-002', 'Kit Protese Total', 1, 2500.00)]:
        cur.execute('INSERT INTO catalogo_kits (sku, empresa_id, nome, preco, ativo) VALUES (%s, %s, %s, %s, true)', (sku, eid, nome, preco))
        kit_skus.append(sku)
    counts['kits'] = len(kit_skus)

    # 21. Grupos Clientes
    gcli_ids = []
    for nome, tipo, desc, desc_pct in [('Padrao', 'percentual', 'Grupo padrao', 0), ('Parceiros', 'percentual', 'Desconto 10%', 10), ('Revendedores', 'fixo', 'Preco de custo', 0)]:
        gid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_grupos_clientes (id, empresa_id, nome, descricao, preco_tipo, desconto_percentual, ativo) VALUES (%s, %s, %s, %s, %s, %s, true)', (gid, eid, nome, desc, tipo, desc_pct))
        gcli_ids.append(gid)
    counts['grupos_clientes'] = len(gcli_ids)

    # 22. Clientes
    cli_ids = []
    for nome, email, tel, tipo, gidx in [('Joao Silva', 'joao@email.com', '11999990001', 'cliente', 0), ('Maria Santos', 'maria@email.com', '11999990002', 'parceiro', 1), ('Pedro Ltda', 'pedro@email.com', '11999990003', 'revendedor', 2)]:
        cid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_clientes (id, empresa_id, nome, email, telefone, tipo, grupo_id, ativo) VALUES (%s, %s, %s, %s, %s, %s, %s, true)', (cid, eid, nome, email, tel, tipo, gcli_ids[gidx]))
        cli_ids.append(cid)
    counts['clientes'] = len(cli_ids)

    # 23. Solicitacoes
    for nome, email, status in [('Ana Paula', 'ana@email.com', 'pendente'), ('Carlos Lima', 'carlos@email.com', 'aprovada')]:
        sid = str(uuid.uuid4())
        cur.execute('INSERT INTO catalogo_solicitacoes_acesso (id, empresa_id, nome, email, status) VALUES (%s, %s, %s, %s, %s)', (sid, eid, nome, email, status))
    counts['solicitacoes'] = 2

    # 24. Favoritos
    cur.execute('INSERT INTO catalogo_favoritos (empresa_id, cliente_id, produto_sku, produto_tipo) VALUES (%s, %s, %s, %s)', (eid, cli_ids[0], 'IMP-001', 'implante'))
    counts['favoritos'] = 1

    # 25. Orcamentos
    orc_id = str(uuid.uuid4())
    cur.execute('INSERT INTO catalogo_orcamentos (id, empresa_id, cliente_id, cliente_nome, cliente_email, status, valor_subtotal, valor_total) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)', (orc_id, eid, cli_ids[0], 'Joao Silva', 'joao@email.com', 'aprovado', 900.00, 900.00))
    cur.execute('INSERT INTO catalogo_orcamento_itens (empresa_id, orcamento_id, produto_sku, produto_tipo, produto_nome, quantidade, preco_unitario) VALUES (%s, %s, %s, %s, %s, %s, %s)', (eid, orc_id, 'IMP-001', 'implante', 'Implante Standard 3.5x10', 2, 450.00))
    counts['orcamentos'] = 1

    # 26. Pedidos
    ped_id = str(uuid.uuid4())
    cur.execute('INSERT INTO catalogo_pedidos (id, empresa_id, cliente_id, orcamento_id, status, valor_subtotal, valor_frete, valor_total, cliente_nome, cliente_email) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', (ped_id, eid, cli_ids[0], orc_id, 'pendente', 900.00, 50.00, 950.00, 'Joao Silva', 'joao@email.com'))
    cur.execute('INSERT INTO catalogo_pedido_itens (empresa_id, pedido_id, produto_sku, produto_tipo, produto_nome, quantidade, preco_unitario) VALUES (%s, %s, %s, %s, %s, %s, %s)', (eid, ped_id, 'IMP-001', 'implante', 'Implante Standard 3.5x10', 2, 450.00))
    counts['pedidos'] = 1

    total = sum(counts.values())
    results[ename] = counts
    print(f'  Total: {total} registros')

conn.commit()
print('\n=== RESUMO ===')
for ename, counts in results.items():
    print(f'{ename}: {sum(counts.values())} registros')
print('\nDONE')

cur.close()
conn.close()
