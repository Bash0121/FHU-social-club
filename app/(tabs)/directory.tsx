import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
import { Linking } from "react-native";

const StudentsData = "https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0d0031eeec7294/files/690f03d10035f9ccabc5/view?project=68f8eca50022e7d7ec23&mode=admin"

type Students = {
  id: number
  firstName: string
  lastName: string
  relationshipStatus: "complicated" | "taken" | "single" | string
  classification: "Freshman" | "Sophomore" | "Junior" | "Senior" | string;
  email: string
  phone: string
  showEmail: boolean
  showPhone: boolean
  imageURL: string
  officer: string
  club:"xbx" | "pka" | "oc" | "xcd" | "ep" | string
}

export default function TabOneScreen() {
  const {user, member, loading} = useAuth()
  const router = useRouter();

  const [students, setStudents] = useState<Students[]>([])
  const [query, setQuery] = useState("")
  const [selectedStudentId, setSelectedStudent] = useState<number | null>(null)
  const [profileVisability, setProfileVisability] = useState(false)
  const [userClub, setUserClub] = useState(null)


   useLayoutEffect(() => {
  if (!loading && !user) {
    setSelectedStudent(null)
    setProfileVisability(false)
    router.replace("/(tabs)");
    }
}, [user, loading]);

if (!user) {
  return (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  <Text>If you want to see this page, then please <Text style={{ color: "blue", textDecorationLine: "underline" }} onPress={() => router.replace("/auth")}>Log In</Text></Text>
  </View>
  )
}

    useEffect(() => {
    let isMounted = true
    async function load() {
      const res = await fetch(StudentsData, {method: "GET"})
      const json = await(res.json()) as Students[]
      if (isMounted) {
        setStudents(json)
      }
    }

    load ()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredWithMemoization = useMemo( ()=> {
  if (!students || students.length === 0) return[]

  const q = query.trim().toLowerCase()
  return students.filter((person) => {
    const sameClub = person.club === member?.club
    const matchesQuery = 
    person.firstName.toLowerCase().includes(q) ||
    person.lastName.toLowerCase().includes(q)
    return sameClub && (q === "" || matchesQuery)
  })
  }, [query, member, students])

 const selectedStudent = useMemo(() => {
  if (!user || students.length === 0 || selectedStudentId === null) return null
  return students.find(student => student.id === selectedStudentId) ?? null
}, [students, selectedStudentId, user])


  const profileOn = (id: number) => {
    setSelectedStudent(id)
    setProfileVisability(true)
  }

  const profileOff = () => {
    setSelectedStudent(null)
    setProfileVisability(false)
  }


  const renderStudent = ({item}: {item: Students}) => {
    return (
      <View style={styles.container}>
        <Text style={styles.mainPageName}>{item.firstName} {item.lastName}</Text>
        <Image source={{uri: item.imageURL}} width={100} height={100} />
         <Text style={styles.mainPageStats}>{item.officer}</Text>
        

        <TouchableOpacity onPress={() => profileOn(item.id)}>
          <Ionicons name="arrow-forward-circle-outline" size={50} style={styles.icon}/>
        </TouchableOpacity>
      </View>
    )


  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
    {loading || !user ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <>
      <Text style={styles.title}>{member?.club}'s Club Directory</Text>

      <View style={{backgroundColor: 'black'}}>
      <TextInput
        placeholder="Search by first or last name..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        style={styles.SearchBar}
      />
      </View>

        <FlatList 
        data={filteredWithMemoization}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudent}
        style={{backgroundColor: 'black'}}
        ItemSeparatorComponent={() => <View style={{alignItems: "center"}}><View style={styles.separator} /></View>}
        ListEmptyComponent={
          <View>
            <Text>
               No students match “{query}”.
            </Text>
          </View>
            }
            contentContainerStyle={
              filteredWithMemoization.length === 0 ? { flex: 1 } : undefined
            }
        />
        {profileVisability && selectedStudent && (
        <Modal visible = {profileVisability}>
          <View style={{backgroundColor: 'black'}}>
            <TouchableOpacity onPress={profileOff}>
              <Ionicons name="close-circle-outline" size={60} style={{color: 'white'}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>

            <Image source={{uri: selectedStudent?.imageURL}} width={250} height={250}/>
            <Text style={styles.modalPageName}>{selectedStudent?.firstName} {selectedStudent?.lastName}</Text>
            <Text style={styles.modalPageStats}>{selectedStudent?.officer}</Text>
            <Text style={styles.modalPageStats}>{selectedStudent?.classification}</Text>
            <Text style={styles.modalPageStats}>{selectedStudent?.relationshipStatus}</Text>
            <Text style={styles.modalPageStats}>{selectedStudent?.club}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${selectedStudent?.email}`)}>
            {selectedStudent?.showEmail && <Text style={[styles.modalPageStats, { color: "blue", textDecorationLine: "underline" }]}>{selectedStudent?.email}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedStudent?.phone}`)}>
            {selectedStudent?.showPhone && <Text style={[styles.modalPageStats, { color: "blue", textDecorationLine: "underline" }]}>{selectedStudent?.phone}</Text>}
            </TouchableOpacity>
            <View style={styles.separator}></View>
            </View>
        </Modal>
        )}
      </>
    )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
   modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    flex: 1
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'black'
  },
  SearchBar: {
    width: '80%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'yellow',
    marginBottom: 25,
    backgroundColor: 'black',
    color: 'white'
  },
  mainPageName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  mainPageStats: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
  },
  separator: {
    height: 2,
    width: '80%',
    backgroundColor: 'yellow'
  },
  icon: {
    color: "white",
  },
  ModalImage: {
    alignItems: "center",
   justifyContent: "center",
   marginTop: 35
  },
  modalPageName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  modalPageStats: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: 'white'
  },
});
