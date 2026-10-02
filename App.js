import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';

const ResumoFinanceiro = ({ renda, gastos, saldo, porcentagemGasta }) => {
  const ePositivo = saldo >= 0;

  return (
    <View style={styles.cardResumo}>
      <Text style={styles.tituloResumo}>✦ RESUMO DO MÊS ✦</Text>

      <View style={styles.linhaResumo}>
        <Text style={styles.labelResumo}>Renda Total:</Text>
        <Text style={styles.valorResumo}>R$ {renda.toFixed(2)}</Text>
      </View>

      <View style={styles.linhaResumo}>
        <Text style={styles.labelResumo}>Total de Gastos:</Text>
        <Text style={styles.valorResumo}>R$ {gastos.toFixed(2)}</Text>
      </View>

      <View style={styles.divisoria} />

      <View style={styles.linhaResumo}>
        <Text style={styles.labelResumo}>Saldo Restante:</Text>
        <Text style={[styles.valorResumo, ePositivo ? styles.saldoPositivo : styles.saldoNegativo]}>
          R$ {saldo.toFixed(2)}
        </Text>
      </View>

      <View style={styles.caixaStatus}>
        <Text style={styles.textoStatus}>
          {ePositivo ? 'Orçamento Sob Controle' : 'Gastos Acima da Renda'}
        </Text>
        <Text style={styles.textoPorcentagem}>
          Você comprometeu {porcentagemGasta.toFixed(1)}% da sua renda.
        </Text>
      </View>
    </View>
  );
};

const PainelEstatisticas = ({ historico }) => {
  if (historico.length === 0) {
    return (
      <View style={styles.cardResumo}>
        <Text style={styles.textoVazio}>
          Nenhum mês guardado no histórico ainda. Faça uma simulação e clique em "Guardar Mês".
        </Text>
      </View>
    );
  }

  const totalRendaAcumulada = historico.reduce((acc, item) => acc + item.renda, 0);
  const totalGastosAcumulados = historico.reduce((acc, item) => acc + item.gastos, 0);
  const totalSobraAcumulada = historico.reduce((acc, item) => acc + (item.saldo > 0 ? item.saldo : 0), 0);

  const fundoEmergencia = totalSobraAcumulada * 0.5;
  const fundoObjetivos = totalSobraAcumulada * 0.3;
  const fundoLazer = totalSobraAcumulada * 0.2;

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.cardResumo}>
        <Text style={styles.tituloResumo}>📊 ESTATÍSTICAS ACUMULADAS</Text>
        <Text style={styles.subtituloSecao}>
          Mêses Guardados: {historico.length}
        </Text>

        <View style={styles.linhaResumo}>
          <Text style={styles.labelResumo}>Total Entrado:</Text>
          <Text style={styles.valorResumo}>R$ {totalRendaAcumulada.toFixed(2)}</Text>
        </View>

        <View style={styles.linhaResumo}>
          <Text style={styles.labelResumo}>Total Gasto:</Text>
          <Text style={styles.valorResumo}>R$ {totalGastosAcumulados.toFixed(2)}</Text>
        </View>

        <View style={styles.linhaResumo}>
          <Text style={styles.labelResumo}>Economia Guardada:</Text>
          <Text style={[styles.valorResumo, styles.saldoPositivo]}>
            R$ {totalSobraAcumulada.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.cardResumo, { marginTop: 15 }]}>
        <Text style={styles.tituloResumo}>🔮 DIVISÃO NOS FUNDOS / CAIXINHAS</Text>
        
        <View style={styles.itemFundo}>
          <Text style={styles.nomeFundo}>🛡️ Fundo de Emergência (50%)</Text>
          <Text style={styles.valorFundo}>R$ {fundoEmergencia.toFixed(2)}</Text>
        </View>

        <View style={styles.itemFundo}>
          <Text style={styles.nomeFundo}>🎯 Fundo de Objetivos (30%)</Text>
          <Text style={styles.valorFundo}>R$ {fundoObjetivos.toFixed(2)}</Text>
        </View>

        <View style={styles.itemFundo}>
          <Text style={styles.nomeFundo}>✨ Fundo de Lazer Futuro (20%)</Text>
          <Text style={styles.valorFundo}>R$ {fundoLazer.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={[styles.labelInput, { marginTop: 20, textAlign: 'center', color: '#1B2A3A' }]}>
        📜 MÊSES ARQUIVADOS
      </Text>
      {historico.map((item, index) => (
        <View key={index} style={styles.cardHistoricoItem}>
          <Text style={styles.textoDataHistorico}>{item.nomeMes}</Text>
          <Text style={styles.textoHistoricoDetalhe}>
            Renda: R$ {item.renda.toFixed(2)} | Gastos: R$ {item.gastos.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.textoHistoricoSaldo,
              item.saldo >= 0 ? styles.saldoPositivo : styles.saldoNegativo,
            ]}
          >
            Sobra: R$ {item.saldo.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('simulador');

  const [nomeMes, setNomeMes] = useState('');
  const [rendaInput, setRendaInput] = useState('');
  const [moradiaInput, setMoradiaInput] = useState('');
  const [alimentacaoInput, setAlimentacaoInput] = useState('');
  const [transporteInput, setTransporteInput] = useState('');
  const [lazerInput, setLazerInput] = useState('');

  const [renda, setRenda] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [porcentagemGasta, setPorcentagemGasta] = useState(0);
  const [calculado, setCalculado] = useState(false);

  const [historico, setHistorico] = useState([]);

  const calcularOrcamento = () => {
    const vRenda = parseFloat(rendaInput.replace(',', '.')) || 0;
    const vMoradia = parseFloat(moradiaInput.replace(',', '.')) || 0;
    const vAlimentacao = parseFloat(alimentacaoInput.replace(',', '.')) || 0;
    const vTransporte = parseFloat(transporteInput.replace(',', '.')) || 0;
    const vLazer = parseFloat(lazerInput.replace(',', '.')) || 0;

    const gastosCalculados = vMoradia + vAlimentacao + vTransporte + vLazer;
    const saldoCalculado = vRenda - gastosCalculados;
    const pctGasta = vRenda > 0 ? (gastosCalculados / vRenda) * 100 : 0;

    setRenda(vRenda);
    setTotalGastos(gastosCalculados);
    setSaldo(saldoCalculado);
    setPorcentagemGasta(pctGasta);
    setCalculado(true);
  };

  const guardarMes = () => {
    if (!calculado) return;

    const novoRegistro = {
      nomeMes: nomeMes.trim() || `Mês ${historico.length + 1}`,
      renda,
      gastos: totalGastos,
      saldo,
    };

    setHistorico([...historico, novoRegistro]);
    limparCampos();
    setAbaAtiva('estatisticas');
  };

  const limparCampos = () => {
    setNomeMes('');
    setRendaInput('');
    setMoradiaInput('');
    setAlimentacaoInput('');
    setTransporteInput('');
    setLazerInput('');
    setRenda(0);
    setTotalGastos(0);
    setSaldo(0);
    setPorcentagemGasta(0);
    setCalculado(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E8E3D5" />

      <View style={styles.conteudoCentralizado}>
        <Text style={styles.tituloApp}>Simulador e Cofre Financeiro</Text>

        <View style={styles.containerAbas}>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'simulador' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('simulador')}
          >
            <Text style={[styles.textoAba, abaAtiva === 'simulador' && styles.textoAbaAtiva]}>
              Simulador
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'estatisticas' && styles.abaAtiva]}
            onPress={() => setAbaAtiva('estatisticas')}
          >
            <Text style={[styles.textoAba, abaAtiva === 'estatisticas' && styles.textoAbaAtiva]}>
              Estatísticas & Fundos
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {abaAtiva === 'simulador' && (
            <View style={{ width: '100%' }}>
              <View style={styles.cardFormulario}>
                <Text style={styles.labelInput}>Identificação do Mês</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Janeiro, Fevereiro..."
                  placeholderTextColor="#7B8A99"
                  value={nomeMes}
                  onChangeText={setNomeMes}
                />

                <Text style={styles.labelInput}>Renda Mensal (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 3000"
                  placeholderTextColor="#7B8A99"
                  keyboardType="numeric"
                  value={rendaInput}
                  onChangeText={setRendaInput}
                />

                <Text style={styles.labelInput}>Moradia (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 1000"
                  placeholderTextColor="#7B8A99"
                  keyboardType="numeric"
                  value={moradiaInput}
                  onChangeText={setMoradiaInput}
                />

                <Text style={styles.labelInput}>Alimentação (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 600"
                  placeholderTextColor="#7B8A99"
                  keyboardType="numeric"
                  value={alimentacaoInput}
                  onChangeText={setAlimentacaoInput}
                />

                <Text style={styles.labelInput}>Transporte (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 300"
                  placeholderTextColor="#7B8A99"
                  keyboardType="numeric"
                  value={transporteInput}
                  onChangeText={setTransporteInput}
                />

                <Text style={styles.labelInput}>Lazer (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 200"
                  placeholderTextColor="#7B8A99"
                  keyboardType="numeric"
                  value={lazerInput}
                  onChangeText={setLazerInput}
                />

                <TouchableOpacity style={styles.botaoCalcular} onPress={calcularOrcamento}>
                  <Text style={styles.textoBotaoCalcular}>Calcular Orçamento</Text>
                </TouchableOpacity>
              </View>

              {calculado && (
                <View style={{ marginTop: 15 }}>
                  <ResumoFinanceiro
                    renda={renda}
                    gastos={totalGastos}
                    saldo={saldo}
                    porcentagemGasta={porcentagemGasta}
                  />

                  <TouchableOpacity style={styles.botaoGuardar} onPress={guardarMes}>
                    <Text style={styles.textoBotaoGuardar}>📦 Guardar Mês e Enviar Sobra aos Fundos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.botaoLimpar} onPress={limparCampos}>
                    <Text style={styles.textoBotaoLimpar}>Limpar Campos</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {abaAtiva === 'estatisticas' && <PainelEstatisticas historico={historico} />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E3D5',
    alignItems: 'center',
  },
  conteudoCentralizado: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tituloApp: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1B2A3A',
    marginTop: 20,
    marginBottom: 15,
  },
  containerAbas: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#D6CEBE',
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C2B8A3',
  },
  abaAtiva: {
    backgroundColor: '#1B2A3A',
    borderColor: '#1B2A3A',
  },
  textoAba: {
    fontSize: 13,
    color: '#1B2A3A',
    fontWeight: '600',
  },
  textoAbaAtiva: {
    color: '#E8E3D5',
    fontWeight: '700',
  },
  cardFormulario: {
    backgroundColor: '#F5F1E6',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D0C6B0',
  },
  labelInput: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1B2A3A',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#E8E3D5',
    color: '#1B2A3A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#C0B59E',
  },
  botaoCalcular: {
    backgroundColor: '#8B1E19',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  textoBotaoCalcular: {
    color: '#E8E3D5',
    fontSize: 14,
    fontWeight: '700',
  },
  botaoGuardar: {
    backgroundColor: '#283B4E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoGuardar: {
    color: '#E8E3D5',
    fontSize: 14,
    fontWeight: '700',
  },
  botaoLimpar: {
    backgroundColor: '#D0C6B0',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoLimpar: {
    color: '#1B2A3A',
    fontSize: 13,
    fontWeight: '600',
  },
  cardResumo: {
    backgroundColor: '#1B2A3A',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#283B4E',
  },
  tituloResumo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E8E3D5',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtituloSecao: {
    fontSize: 12,
    color: '#9BB1C9',
    textAlign: 'center',
    marginBottom: 10,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  labelResumo: {
    fontSize: 14,
    color: '#C8D6E5',
  },
  valorResumo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E8E3D5',
  },
  divisoria: {
    height: 1,
    backgroundColor: '#283B4E',
    marginVertical: 8,
  },
  saldoPositivo: {
    color: '#71B280',
  },
  saldoNegativo: {
    color: '#E57373',
  },
  caixaStatus: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#283B4E',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8E3D5',
  },
  textoPorcentagem: {
    fontSize: 12,
    color: '#9BB1C9',
    marginTop: 2,
  },
  textoVazio: {
    color: '#E8E3D5',
    textAlign: 'center',
    fontSize: 14,
  },
  itemFundo: {
    backgroundColor: '#283B4E',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nomeFundo: {
    fontSize: 13,
    color: '#E8E3D5',
  },
  valorFundo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71B280',
  },
  cardHistoricoItem: {
    backgroundColor: '#F5F1E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D0C6B0',
  },
  textoDataHistorico: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2A3A',
  },
  textoHistoricoDetalhe: {
    fontSize: 12,
    color: '#4B5A6A',
    marginTop: 2,
  },
  textoHistoricoSaldo: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
});