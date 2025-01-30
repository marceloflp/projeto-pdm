import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IPilotos } from "@/interfaces/ipilotos";
import { ThemedView } from "@/components/ThemedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

export default function pilotoDetailScreen(){
    const {pilotoId} = useLocalSearchParams();
    const [pilotoForDetail, setPilotoForDetail] = useState<IPilotos>();
    const [pilotos, setPilotos] = useState<IPilotos[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        async function getData() {
            try {
                const data = await AsyncStorage.getItem('@my-app : pilotos');
                const pilotosData: IPilotos[] = data != null ? JSON.parse(data) : [];
                setPilotos(pilotosData);

                pilotosData.forEach((element) =>{
                    if(element.id.toString() == pilotoId){
                        setPilotoForDetail(element);
                    }
                });
            } catch (e) {   
            }
        }

        getData()
    }, [])

    const onDelete = () => {
        if(pilotoForDetail){
            const newPilotos: Array<IPilotos> = [];

            for (let index = 0; index <pilotos.length; index++){
                const piloto = pilotos[index];

                if(piloto.id != pilotoForDetail!.id){
                    newPilotos.push(piloto);
                }
            }

            setPilotos(newPilotos);
            AsyncStorage.setItem("@my-app : pilotos", JSON.stringify(newPilotos));
        }
        
        router.replace("/pilotoListScreen");

    };

    const openModal = () => {
        setModalVisible(true);
    };

    return(
        <View>
            <ThemedView style={styles.headerContainer}>
                <TouchableOpacity onPress={() => onDelete()}>
                    <Text style={styles.headerButton}>Deletar</Text>
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.box}>
                <Text style={styles.title}>{pilotoForDetail ? pilotoForDetail.nome: ''}</Text>
                <Text style={styles.title}>{pilotoForDetail ? pilotoForDetail.equipe: ''}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        backgroundColor:'white',
        alignItems:'center',
        padding: 20,
        margin: 20,
        borderRadius: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subTitle:{
        fontSize: 10,
    },
    headerButton:{
        color:'red',
        fontWeight:'bold',
        fontSize:20,
        paddingHorizontal: 20,
    },
    headerContainer:{
        backgroundColor:'gray',
        alignItems:'center',
        justifyContent:'center',
    }
})
