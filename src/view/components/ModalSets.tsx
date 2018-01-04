import * as React from 'react'
import {View, Modal, Picker, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Grid, Row, Col} from 'react-native-easy-grid'
import * as loDash from 'lodash'

type IProps = {
  modifySet: (reps: number, weight: number) => void
  reps: number
  weight: number
  closeModal: () => void
}

type IState = {
  currentReps: number
  currentWeight: number
}


class ModalSets extends React.PureComponent<IProps, IState> {

  componentWillMount() {
    this.state = {currentReps: this.props.reps, currentWeight: this.props.weight}
  }

  render() {
    const {currentReps, currentWeight} = this.state
    return (
      <View>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <View style={styles.viewOpacity}/>
            <View style={styles.viewPickers}>
              <View style={styles.viewButtons}>
                <TouchableOpacity
                  style={styles.buttonDelete}
                  onPress={() => this.props.closeModal()}>
                  <Text style={styles.textDelete}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonSave}
                  onPress={() => {
                    this.props.modifySet(currentReps, currentWeight)
                    this.props.closeModal()
                  }}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
              <Grid style={styles.grid}>
                <Col style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Row size={10}>
                    <Text>Reps:</Text>
                  </Row>
                  <Row size={90}>
                    <Picker
                      style={styles.picker}
                      itemStyle={{fontSize: 14}}
                      selectedValue={currentReps}
                      onValueChange={(itemValue) => this.setState({currentReps: itemValue})}>
                      {loDash.range(1, 30).map((value: number) => {
                        return <Picker.Item key={value} label={value.toString()} value={value}/>
                      })}
                    </Picker>
                  </Row>
                </Col>
                <Col style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Row size={10}>
                    <Text>Weight:</Text>
                  </Row>
                  <Row size={90}>
                    <Picker
                      style={styles.picker}
                      itemStyle={{fontSize: 14}}
                      selectedValue={currentWeight}
                      onValueChange={(itemValue) => this.setState({currentWeight: itemValue})}>
                      {loDash.range(1, 500).map((value: number) => {
                        return <Picker.Item key={value} label={value.toString()} value={value}/>
                      })}
                    </Picker>
                  </Row>
                </Col>
              </Grid>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    width: 100,
    height: 'auto'
  },
  container: {
    flex: 1
  },
  viewOpacity: {
    backgroundColor: 'black',
    opacity: 0.5,
    flex: 1
  },
  viewPickers: {
    flex: 1,
    backgroundColor: '#F7F7F8'
  },
  viewButtons: {
    flexDirection: 'row',
    backgroundColor: '#EFEFF4',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1
  },
  buttonDelete: {
    position: 'absolute',
    left: 20
  },
  buttonSave: {
    position: 'absolute',
    right: 20
  },
  grid: {
    padding: 20
  },
  textDelete: {
    color: 'red'
  }
})

export default ModalSets
