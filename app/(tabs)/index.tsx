import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
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

const StudentsData = "https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0d0031eeec7294/files/68fbe0130016a7d10f58/view?project=68f8eca50022e7d7ec23&mode=admin"

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
}

export default function TabOneScreen() {
  const [students, setStudents] = useState<Students[]>([])
  const [query, setQuery] = useState("")
  const [selectedStudentId, setSelectedStudent] = useState<number | null>(null)
  const [profileVisability, setProfileVisability] = useState(false)

  const selectedStudent = students.find(student => student.id === selectedStudentId)

  const profileOn = (id: number) => {
    setSelectedStudent(id)
    setProfileVisability(true)
  }

  const profileOff = () => {
    setSelectedStudent(null)
    setProfileVisability(false)
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
    const q = query.trimEnd().toLowerCase()

    if(!q) return students

    return students.filter((person) => {
      return person.firstName.toLowerCase().includes(q) || 
              person.lastName.toLowerCase().includes(q)
    }
  )
  }, [query, students])


  const renderStudent = ({item}: {item: Students}) => {
    return (
      <View>
        <Text>{item.firstName} {item.lastName}</Text>
        <Text>{item.classification}</Text>
        <Text>{item.officer}</Text>
        <Image source={{uri: item.imageURL}} width={50} height={50} />
        {item.showEmail && <Text>{item.email}</Text>}
        {item.showPhone && <Text>{item.phone}</Text>}

        <TouchableOpacity onPress={() => profileOn(item.id)}>
          <Ionicons name="arrow-forward-circle" size={50}/>
        </TouchableOpacity>
      </View>
    )


  }
  return (
    <SafeAreaView>
      <Text>Club Directory</Text>

      <TextInput
        placeholder="Search by first or last name..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <>
        <FlatList 
        data={filteredWithMemoization}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStudent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
        <Modal visible = {profileVisability}>
          <Text>{selectedStudent?.firstName} {selectedStudent?.lastName}</Text>
           <TouchableOpacity onPress={profileOff}>
          <Ionicons name="arrow-forward-circle" size={50}/>
        </TouchableOpacity>
        </Modal>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
