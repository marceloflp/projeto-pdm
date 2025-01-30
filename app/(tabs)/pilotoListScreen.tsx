import { Image, StyleSheet, TouchableOpacity, Text } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import Pilotos from "@/components/pilotos/Pilotos";
import MyScrollView from "@/components/MyScrollView";
import { useEffect, useState } from "react";
import { IPilotos } from "@/interfaces/ipilotos";
import PilotoModal from "@/components/modals/PilotoModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from 'expo-router';

export default function pilotoListScreen(){
    const [pilotos, setPilotos] = useState<IPilotos[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPiloto, setSelectedPiloto] = useState<IPilotos>();

    const [location, setLocation] = useState({});
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function getData() {
            try {
                const data = await AsyncStorage.getItem('@my-app : pilotos');
                const pilotosData = data != null ? JSON.parse(data) : [];
                setPilotos(pilotosData);
            } catch (e) {

            }
        }
        getData()
    }, [])

    useEffect(() => {
        (async () => {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to acess location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, [])
    
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location){
        text = JSON.stringify(location);
    }

    const onAdd =  async (nome: string, equipe: string, id?: number) => {

        if(!id || id<=0){
            const newPiloto: IPilotos = {
                id: Math.random() * 1000,
                nome: nome,
                equipe: equipe
            };

            const pilotosPlus: IPilotos[] = [
                ...pilotos,
                newPiloto
            ];
        
            setPilotos(pilotosPlus)
            AsyncStorage.setItem("@my-app : pilotos", JSON.stringify(pilotosPlus));
    } else{
        pilotos.forEach(piloto => {
            if(piloto.id == id){
                piloto.nome = nome;
                piloto.equipe = equipe;
            }
        })

        AsyncStorage.setItem("@my-app : pilotos", JSON.stringify(pilotos));
    };

    setModalVisible(false);
};
    const onDelete = (id: number) => {
        const newPilotos: Array<IPilotos> = [];

        for (let index = 0; index <pilotos.length; index++){
            const piloto = pilotos[index];

            if(piloto.id != id){
                newPilotos.push(piloto);
            }
        }

        setPilotos(newPilotos);
        AsyncStorage.setItem("@my-app : pilotos", JSON.stringify(newPilotos));
        setModalVisible(false);
    };

    const openModal = () => {
        setSelectedPiloto(undefined);
        setModalVisible(true);
    };

    const openEditModal = (selectedPiloto: IPilotos) => {
        setSelectedPiloto(selectedPiloto);
        setModalVisible(true);
    }

    const navigateToDetails = (selectedPiloto: IPilotos) => {
        router.push({ pathname: '/Screens/PilotosDetailScreen', params: {pilotoId: selectedPiloto.id}})
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    return (
        <MyScrollView
            headerBackgroundColor={{ light: '#300100', dark: '#1D3D47' }}
            headerImage={
                <Image
                source={require('@/assets/images/f1-logo-4.png')}
                style={styles.reactLogo}
                />
            }>
                <ThemedView style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => openModal()}>
                        <Text style={styles.headerButton}>Adicionar Piloto</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerButton}>{text}</Text>
                </ThemedView>
                <ThemedView style={styles.container}>

                    {pilotos.map(piloto => 
                        <TouchableOpacity onPress={() => navigateToDetails(piloto)}>
                            <Pilotos key={piloto.id} title={piloto.nome} subTitle={piloto.equipe}/>
                        </TouchableOpacity>
                    )}
                    
                </ThemedView>

                <PilotoModal
                    visible={modalVisible}
                    onCancel={closeModal}
                    onAdd={onAdd}
                    onDelete={onDelete}
                    piloto={selectedPiloto}
                />
        </MyScrollView>
    )
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems:'center',
        gap:8,
    },
    stepContainer: {
        gap:8,
        marginBottom:8,
    },
    reactLogo:{
        height:90,
        width: 350,
        bottom: 70,
        alignSelf: 'center',
        position: 'absolute',
    },
    container:{
        flex:1,
        backgroundColor:'gray',
    },
    headerContainer:{
        backgroundColor:'rgb(37, 121, 193)',
        alignItems:'center',
        justifyContent:'center',
    },
    headerButton:{
        color:'black',
        fontSize:30,
        paddingHorizontal:20,
    }
})
