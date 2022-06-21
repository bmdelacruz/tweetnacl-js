package main

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"golang.org/x/crypto/curve25519"
	"golang.org/x/crypto/nacl/box"
	"golang.org/x/crypto/nacl/secretbox"
)

func writeTestDataJsFile(fileName, variableName string, data interface{}) {
	outputFile, err := os.Create(fmt.Sprintf("./dist-test/data/%s.js", fileName))
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := outputFile.Close(); err != nil {
			panic(err)
		}
	}()
	outputWriter := bufio.NewWriter(outputFile)
	_, err = outputWriter.WriteString(fmt.Sprintf("var %s = ", variableName))
	if err != nil {
		panic(err)
	}
	encoder := json.NewEncoder(outputWriter)
	err = encoder.Encode(data)
	if err != nil {
		panic(err)
	}
	_, err = outputWriter.WriteString(";")
	if err != nil {
		panic(err)
	}
	err = outputWriter.Flush()
	if err != nil {
		panic(err)
	}
}

func makeSecretBoxTestData() {
	type testCaseData struct {
		i       int
		Message string `json:"m"`
		Key     string `json:"k"`
		Nonce   string `json:"n"`
		Box     string `json:"b"`
	}

	var message [768]byte
	var key [32]byte
	var nonce [24]byte
	var testCases [768]testCaseData

	for i := 0; i < len(testCases); i++ {
		n, err := rand.Read(key[:])
		if err != nil || n != len(key) {
			panic(err)
		}
		n, err = rand.Read(nonce[:])
		if err != nil || n != len(nonce) {
			panic(err)
		}
		n, err = rand.Read(message[:i])
		if err != nil || n != i {
			panic(err)
		}
		box := secretbox.Seal(nil, message[:i], &nonce, &key)

		testCases[i] = testCaseData{
			i:       i,
			Message: base64.StdEncoding.EncodeToString(message[:i]),
			Nonce:   base64.StdEncoding.EncodeToString(nonce[:]),
			Key:     base64.StdEncoding.EncodeToString(key[:]),
			Box:     base64.StdEncoding.EncodeToString(box),
		}
	}

	writeTestDataJsFile("secretbox", "secretBoxData", testCases)
}

func makeScalarMultData() {
	type testCaseData struct {
		i           int
		PrivateKey1 string `json:"prv1"`
		PrivateKey2 string `json:"prv2"`
		PublicKey1  string `json:"pub1"`
		PublicKey2  string `json:"pub2"`
		SharedKey   string `json:"sk"`
	}

	var testCases [256]testCaseData
	var sk1, sk2 [32]byte

	for i := 0; i < len(testCases); i++ {
		pub1, prv1, err := box.GenerateKey(rand.Reader)
		if err != nil {
			panic(err)
		}
		pub2, prv2, err := box.GenerateKey(rand.Reader)
		if err != nil {
			panic(err)
		}

		curve25519.ScalarMult(&sk1, prv1, pub2)
		curve25519.ScalarMult(&sk2, prv2, pub1)

		if bytes.Compare(sk1[:], sk2[:]) != 0 {
			panic("differ")
		}

		testCases[i] = testCaseData{
			i:           i,
			PrivateKey1: base64.StdEncoding.EncodeToString(prv1[:]),
			PrivateKey2: base64.StdEncoding.EncodeToString(prv2[:]),
			PublicKey1:  base64.StdEncoding.EncodeToString(pub1[:]),
			PublicKey2:  base64.StdEncoding.EncodeToString(pub2[:]),
			SharedKey:   base64.StdEncoding.EncodeToString(sk1[:]),
		}
	}

	writeTestDataJsFile("scalarmult", "scalarMultData", testCases)
}

func makeBoxData() {
	type testCaseData struct {
		i           int
		PublicKey1  string `json:"pub1"`
		PrivateKey2 string `json:"prv2"`
		Nonce       string `json:"nonce"`
		Message     string `json:"msg"`
		Box         string `json:"box"`
	}

	var testCases [256]testCaseData
	var message [256]byte
	var nonce [24]byte // zero nonce

	for i := 0; i < len(testCases); i++ {
		pub1, _, err := box.GenerateKey(rand.Reader)
		if err != nil {
			panic(err)
		}
		_, prv2, err := box.GenerateKey(rand.Reader)
		if err != nil {
			panic(err)
		}
		n, err := rand.Read(message[:i])
		if err != nil || n != i {
			panic(err)
		}
		box := box.Seal(nil, message[:i], &nonce, pub1, prv2)

		testCases[i] = testCaseData{
			i:           i,
			PublicKey1:  base64.StdEncoding.EncodeToString(pub1[:]),
			PrivateKey2: base64.StdEncoding.EncodeToString(prv2[:]),
			Nonce:       base64.StdEncoding.EncodeToString(nonce[:]),
			Message:     base64.StdEncoding.EncodeToString(message[:i]),
			Box:         base64.StdEncoding.EncodeToString(box),
		}
	}

	writeTestDataJsFile("box", "boxData", testCases)
}

func main() {
	makeSecretBoxTestData()
	makeScalarMultData()
	makeBoxData()
}
