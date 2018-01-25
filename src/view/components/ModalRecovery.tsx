import * as React from 'react'
import {Modal, Picker, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

type IProps = {
  closeModal: () => void
}

type IState = {
  currentRecovery: string
}

class ModalRecovery extends React.PureComponent<IProps, IState> {

  constructor() {
    super()
    this.state = {currentRecovery: '00:30'}
  }

  render() {
    const {currentRecovery} = this.state
    return (
      <View>
        <Modal
          onRequestClose={() => console.log('close')}
          visible={true}
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <View style={styles.viewOpacity}/>
            <View style={styles.viewModal}>
              <View style={styles.viewButtons}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  onPress={() => {
                    this.props.closeModal()
                  }}>
                  <Text>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.viewPicker}>
                <Picker
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                  selectedValue={currentRecovery}
                  onValueChange={(itemValue) => this.setState({currentRecovery: itemValue})}>
                  {['00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00'].map((value: string) => {
                    return <Picker.Item key={value} label={value.toString()} value={value}/>
                  })}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    width: 200,
    height: 'auto',
    marginBottom: 80
  },
  container: {
    flex: 1
  },
  viewOpacity: {
    backgroundColor: 'black',
    opacity: 0.5,
    flex: 2
  },
  viewModal: {
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
  buttonSave: {
    position: 'absolute',
    right: 20
  },
  pickerItem: {
    fontSize: 18
  },
  viewPicker: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ModalRecovery
